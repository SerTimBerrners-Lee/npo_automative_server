import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Buyer } from 'src/buyer/buyer.model';
import { DocumentsService } from 'src/documents/documents.service';
import { DateMethods } from 'src/files/date.methods';
import { statusShipment } from 'src/files/enums';
import { Product } from 'src/product/product.model';
import { User } from 'src/users/users.model';
import { ShCheckDto } from './dto/sh-check.dto';
import { ShComplit } from './sh-complit.model';
import { Shipments } from './shipments.model';

@Injectable()
export class ShComplitService {
	constructor(@InjectModel(Shipments) private shipmentsReprository: typeof Shipments,
    @InjectModel(ShComplit) private shComplitReprository: typeof ShComplit,
    @InjectModel(User) private userReprository: typeof User,
		private documentsService: DocumentsService) {}

    async create(dto: ShCheckDto, files: any) {
      const sh_complit = await this.shComplitReprository.create({ shipments_id: dto.shipments_id });
      if(!sh_complit) throw new HttpException('Не удолось создать отгрузку', HttpStatus.BAD_REQUEST);

      const DM = new DateMethods();
      const str = String(DM.dt.getUTCFullYear()).slice(2);
      sh_complit.number_complit = `O${str}-${sh_complit.id}`;
      
      sh_complit.date_order = dto.date_order;
      sh_complit.number_order = dto.number_order;
      sh_complit.date_shipments = dto.date_shipments;
      sh_complit.description = dto.description;
      sh_complit.fabric_number = dto.fabric_number;
      sh_complit.name_check = dto.name_check;
      sh_complit.date_create = dto.date_create;
      sh_complit.transport = dto.transport;
      sh_complit.date_shipments_fakt = dto.date_shipments_fakt;
      const child = JSON.parse(dto.childrens);

      if (dto.responsible_user_id && dto.responsible_user_id != 'null') {
        const user = await this.userReprository.findByPk(dto.responsible_user_id);
        if (user) {
          sh_complit.responsible_user_id = user.id;
          sh_complit.$add('users', user.id);
        }
      }
      
      if(dto.creater_user_id && dto.creater_user_id != 'null') {
        const user = await this.userReprository.findByPk(dto.creater_user_id);
        if (user) {
          sh_complit.creater_user_id = user.id;
          sh_complit.$add('users', user.id);
        }
      }

      if (child && child.length) {
        for (const item of child) {
          let shipments = await this.shipmentsReprository.findByPk(item.id);
          if (shipments) {
            shipments.status = statusShipment.done;
            shipments.sh_complit_id = sh_complit.id;
            await shipments.save();

            sh_complit.$add('shipments', shipments.id);
          }
        }
      }

      if (dto.docs, files.document) 
        await this.documentsService.attachDocumentForObject(sh_complit, dto, files);
      
      await sh_complit.save();
      return sh_complit;
    }

    async update(dto: ShCheckDto, files: any) {
      const sh_complit = await this.shComplitReprository.findByPk(dto.id);
      if (!sh_complit) throw new HttpException('Не удалось получить отгрузку', HttpStatus.BAD_GATEWAY);

      sh_complit.description = dto.description;

      if (dto.docs, files.document) 
        await this.documentsService.attachDocumentForObject(sh_complit, dto, files);
      await sh_complit.save();
      return sh_complit;
    }

    async getAll() {
      const sh_complits = await this.shComplitReprository.findAll({
        where: {
          ban: false
        },
        include: [
          { all: true },
        {
          model: Shipments,
          include: [
            {
              model: Product,
              attributes: ['name', 'id', 'articl', 'fabricNumber']
            },
            {
              model: Buyer,
              attributes: ['id', 'name']
            }
          ],
        },
      ]});
      if (!sh_complits) throw new HttpException('Не удалось получить список отгрузок', HttpStatus.BAD_REQUEST);
      console.log(sh_complits);

      return sh_complits;
    }

    async getById(id: number) {
      const sh_complit = await this.shComplitReprository.findByPk(id, {include: { all: true }});
      if (!sh_complit) throw new HttpException('Не удалось получить список отгрузок', HttpStatus.BAD_REQUEST);

      return sh_complit;
    }

    async combackComplit(id: number) {
      const complit = await this.shComplitReprository.findByPk(id, {include: [
        { model: Shipments }
      ]});
      if (!complit)
        throw new HttpException('Не удалось получить отгрузку', HttpStatus.BAD_GATEWAY);

      for (const item of complit.shipments) {
        let shipments: Shipments = await this.shipmentsReprository.findByPk(item.id);

        if (shipments) {
          shipments.status = statusShipment.order;
          shipments.sh_complit_id = null;
          await shipments.save();
        }

        complit.ban = true;
        complit.$remove('shipments', item.id);
        await complit.save();
      }

      return true;
    }
}