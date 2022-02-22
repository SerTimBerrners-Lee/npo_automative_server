import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssembleService } from 'src/assemble/assemble.service';
import { WorkingType } from 'src/files/enums';
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

  async getAllWorking() {
    const workings = await this.workingReprository.findAll({include: { all:true }, where: { ban: false }});
    if(!workings)
      throw new HttpException("Произошла ощибка с получением рабочих кластеров", HttpStatus.BAD_REQUEST)
    return workings;
  }

  async createWorking(dto: CreateWorkingDto) {
    const workers_data = dto.workers_data;
    const workers_complect = dto.workers_complect;

    if(!workers_complect.length)
      throw new HttpException("Нет заказов", HttpStatus.BAD_REQUEST);

    console.log(dto);

    const workers = await this.workingReprository.create();
    if(!workers)
      throw new HttpException("No Create Workers", HttpStatus.BAD_REQUEST);

    workers.number_order = workers_data.number_order;
    workers.date_order = workers_data.date_order;

    if(workers_data.type == 'det')
      workers.type = WorkingType.metall;
    else workers.type = WorkingType.ass;

    workers.description = workers_data.description;
    await workers.save()

    for(const item of workers_complect) {
      if(workers_data.type == 'det') {
        const metall = await this.metaloworkingService.createMetaloworking({
          ...workers_data,
          detal_id: item.detal_id,
          my_kolvo: item.my_kolvo,
          shipments_kolvo: item.shipments_kolvo
        })
        workers.$add('metall', metall.id)
      } else {
        const assemble = await this.assembleService.createAssemble({
          ...workers_data,
          cbed_id: item.cbed_id,
          my_kolvo: item.my_kolvo,
          shipments_kolvo: item.shipments_kolvo
        })
        workers.$add('assemble', assemble.id)
      }
    }

    return workers
  }
}
