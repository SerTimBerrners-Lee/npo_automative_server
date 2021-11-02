import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssembleService } from 'src/assemble/assemble.service';
import { DetalService } from 'src/detal/detal.service';
import { StatusAssemble } from 'src/files/enums';
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

        if(dto.ass_id) {
            const ass = await this.assembleService.getAssembleById(dto.ass_id)
            if(ass) {
                if(dto.kol + ass.kolvo_create_in_operation >= ass.kolvo_all) {
                    const nextOperation = await this.returnNextOperation(ass.tp_id, ass.operation_id)
                    if(nextOperation) {
                        ass.kolvo_create_in_operation = 0;
                        ass.operation_id = nextOperation.id
                    } else {
                        ass.kolvo_create_in_operation = ass.kolvo_all
                        ass.kolvo_create = ass.kolvo_all
                        ass.status = StatusAssemble[1]
                    }
                } else 
                    ass.kolvo_create_in_operation = ass.kolvo_create_in_operation + dto.kol

                await ass.save()
            }
        }

        return mark
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
