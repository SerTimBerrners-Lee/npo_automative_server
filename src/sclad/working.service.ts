import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Assemble } from 'src/assemble/assemble.model';
import { AssembleService } from 'src/assemble/assemble.service';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { WorkingType } from 'src/files/enums';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { CreateWorkingDto } from './dto/create-working.dto';
import { Working } from './working.model';

@Injectable()
export class WorkingService {
  constructor(
    @InjectModel(Working) private workingReprository: typeof Working,
    private assembleService: AssembleService,
    private metaloworkingService: MetaloworkingService,
    ) {}

  async getCountWorking() {
      return await this.workingReprository.findAndCountAll()
  }

  async bannedOneWorking(id: number) {
    const working = await this.workingReprository.findByPk(id, {include: { all:true }});
    if (!working) 
      throw new HttpException('Не удалось найти Рабочий сектор', HttpStatus.BAD_GATEWAY);

    working.ban = !working.ban;
    if (working.type == WorkingType.ass) {
      for (const item of working.assemble) {
        await this.assembleService.deleteAssembly(item.id);
      }
    } else if(working.type == WorkingType.metall) {
      for (const item of working.metall) {
        await this.metaloworkingService.deleteMetolloworking(item.id);
      }
    }

    await working.save();
    return working;
  }

  async getOneWorking(id: number) {
    const working = await this.workingReprository.findByPk(id, {include: [
      {
        model: Assemble,
        include: [
          {
            model: Cbed,
            attributes: ['id', 'articl', 'name']
          }
        ]
      },
      {
        model: Metaloworking,
        include: [
          {
            model: Detal,
            attributes: ['id', 'articl', 'name']
          }
        ]
      }
    ]});
    if(!working) 
      throw new HttpException('Не удалось найти Рабочий сектор', HttpStatus.BAD_GATEWAY);

    return working;
  }

  async getAllWorking(archive: string) {
    const workings = await this.workingReprository.findAll({include: [
      {
        model: Assemble,
        include: [
          {
            model: Cbed,
            attributes: ['id', 'articl', 'name']
          }
        ]
      },
      {
        model: Metaloworking,
        include: [
          {
            model: Detal,
            attributes: ['id', 'articl', 'name']
          }
        ]
      }
    ], where: { ban: archive }});
    if (!workings)
      throw new HttpException("Произошла ощибка с получением рабочих кластеров", HttpStatus.BAD_REQUEST)
    return workings;
  }

  async createWorking(dto: CreateWorkingDto) {
    const workers_data = dto.workers_data;
    const workers_complect = dto.workers_complect;

    if (!workers_complect.length)
      throw new HttpException("Нет заказов", HttpStatus.BAD_REQUEST);

    const workers = await this.workingReprository.create();
    if (!workers)
      throw new HttpException("No Create Workers", HttpStatus.BAD_REQUEST);

    workers.number_order = workers_data.number_order;
    workers.date_order = workers_data.date_order;
    workers.date_shipments = workers_data.date_shipments;

    if (workers_data.type == 'det')
      workers.type = WorkingType.metall;
    else workers.type = WorkingType.ass;

    workers.description = workers_data.description;
    await workers.save();

    for (const item of workers_complect) {
      if (workers_data.type == 'det') {
        const metall = await this.metaloworkingService.createMetaloworking({
          ...workers_data,
          detal_id: item.detal_id,
          my_kolvo: item.my_kolvo,
          shipments_kolvo: item.shipments_kolvo
        });
        workers.$add('metall', metall.id);
      } else {
        const assemble = await this.assembleService.createAssemble({
          ...workers_data,
          cbed_id: item.cbed_id,
          my_kolvo: item.my_kolvo,
          shipments_kolvo: item.shipments_kolvo
        });
        workers.$add('assemble', assemble.id);
      }
    }

    return workers;
  }

  async update(id: number, dto: any) {
    const workers = await this.workingReprository.findByPk(id);
    if (!workers)
      throw new HttpException("Произошла ощибка с получением рабочих кластеров", HttpStatus.BAD_REQUEST)
    
    workers.date_shipments = dto.date_shipments;
    workers.description = dto.description;
    await workers.save();
    return workers;
  }
}
