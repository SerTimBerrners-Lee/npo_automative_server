import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Assemble } from 'src/assemble/assemble.model';
import { AssembleService } from 'src/assemble/assemble.service';
import { DetalService } from 'src/detal/detal.service';
import { StatusAssemble } from 'src/files/enums';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { Deficit } from './deficit.model';
import { UpdateDeficitDto } from './dto/create-deficite.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { Marks } from './marks.model';

@Injectable()
export class ScladService {
    constructor(
        @InjectModel(Deficit) private deficitReprository: typeof Deficit,
        @InjectModel(Marks) private marksReprository: typeof Marks,
        private assembleService: AssembleService,
        private detalService: DetalService,
        private metaloworkingService: MetaloworkingService,
        ) {}

    async updateDeficit(dto: UpdateDeficitDto) {
        const deficit = await this.deficitReprository.update(
            {
                minRemainder: dto.minRemainder, 
                recommendedRemainder: dto.recommendedRemainder
            }, 
            {
                where: {id: dto.id}
            })
                
        if(!deficit)
            throw new HttpException('Не удалось обновить таблицу дефицита', HttpStatus.BAD_REQUEST)
        return deficit;
    }

    async getDeficit() {
        return await this.deficitReprository.findAll({include: {all: true}})
    }

    async createMark(dto: CreateMarkDto) {
       const mark = await this.marksReprository.create(dto)
        if(!mark) 
            throw new HttpException('Произошла ошибка при добавлении отметки.', HttpStatus.BAD_REQUEST)

        let obj: any;
        if(dto.ass_id) 
            obj = await this.assembleService.getAssembleById(dto.ass_id)
        else if(dto.metal_id) 
            obj = await this.metaloworkingService.getOneMetaloworkingById(dto.metal_id)

        console.log(dto, obj, mark)
            
        if(!obj) 
            throw new HttpException('Не удалось добавить отметку о выполнении', HttpStatus.BAD_GATEWAY)

        await this.updateObjectWorking(dto, obj)

        return mark
    }

    async updateObjectWorking(dto: CreateMarkDto, obj: Assemble | Metaloworking) {
        if(dto.kol + obj.kolvo_create_in_operation >= obj.kolvo_all) {
            const nextOperation = await this.returnNextOperation(obj.tp_id, obj.operation_id)
            if(nextOperation) {
                obj.kolvo_create_in_operation = 0;
                obj.operation_id = nextOperation.id
            } else {
                obj.kolvo_create_in_operation = obj.kolvo_all
                obj.kolvo_create = obj.kolvo_all
                obj.status = StatusAssemble[1]
            }
        } else 
            obj.kolvo_create_in_operation = obj.kolvo_create_in_operation + dto.kol

        await obj.save()
        return obj
    }

    async returnNextOperation(tp_id: number, operation_id: number) {
        const tp = await this.detalService.getTechProcessById(tp_id)
        if(!tp.operations) return null
        for(let inx = 0; inx < tp.operations.length; inx++) {
            if(tp.operations[inx].id == operation_id)
                return tp.operations[inx + 1]
        }
    }
}
