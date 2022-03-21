import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuyerService } from 'src/buyer/buyer.service';
import { CbedService } from 'src/cbed/cbed.service';
import { DetalService } from 'src/detal/detal.service';
import { DocumentsService } from 'src/documents/documents.service';
import { statusShipment } from 'src/files/enums';
import { ProductService } from 'src/product/product.service';
import { ShCheckDto } from './dto/sh-check.dto';
import { ShComplit } from './sh-complit.model';
import { Shipments } from './shipments.model';

@Injectable()
export class ShComplitService {
	constructor(@InjectModel(Shipments) private shipmentsReprository: typeof Shipments,
    @InjectModel(ShComplit) private shComplitReprository: typeof ShComplit,
		private documentsService: DocumentsService) {}

    async shComplitCreate(dto: ShCheckDto, files: any) {
      console.log(dto)
      const sh_complit = await this.shComplitReprository.create({ shipments_id: dto.shipments_id });
      if(!sh_complit) throw new HttpException('Не удолось создать отгрузку', HttpStatus.BAD_REQUEST);
      
      sh_complit.date_order = dto.date_order;
      sh_complit.number_order = dto.number_order;
      sh_complit.date_shipments = dto.date_shipments;
      sh_complit.description = dto.description;
      sh_complit.fabric_number = dto.fabric_number;
      sh_complit.name_check = dto.name_check;

      const shipments = await this.shipmentsReprository.findByPk(dto.shipments_id);
      if(shipments) {
        shipments.status = statusShipment.done;
        await shipments.save();
      }

      if(dto.docs, files.document) 
            await this.documentsService.attachDocumentForObject(sh_complit, dto, files);
      
      await sh_complit.save();
      return sh_complit;
    }
}