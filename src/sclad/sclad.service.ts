import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssembleService } from 'src/assemble/assemble.service';
import { DetalService } from 'src/detal/detal.service';
import { TechProcess } from 'src/detal/tech-process.model';
import { StatusAssemble, StatusMetaloworking } from 'src/files/enums';
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
            { minRemainder: dto.minRemainder, recommendedRemainder: dto.recommendedRemainder }, 
            { where: {id: dto.id} })
                
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

        await this.checkStatusProcess(dto)
        return mark
    }

    async getMarks() {
        return await this.marksReprository.findAll({include: {all: true}})
    }

    private async checkStatusProcess(dto: CreateMarkDto) {
        let objects: any;
        let tp: TechProcess
        if(dto.assemble_id) objects = await this.assembleService.getAssembleById(dto.assemble_id)
        if(dto.metaloworking_id) objects = await this.metaloworkingService.getOneMetaloworkingById(dto.metaloworking_id)
        if(!objects) 
            throw new HttpException('Произошла ошибка при добавлении отметки2.', HttpStatus.BAD_REQUEST)

        if(dto.assemble_id) 
            if(objects.cbed && objects.cbed.techProcesses) tp = objects.cbed.techProcesses
        if(dto.metaloworking_id) 
            if(objects.detal && objects.detal.techProcesses) tp = objects.detal.techProcesses
            
        if(!tp || !tp.operations || !tp.operations.length) 
            throw new HttpException('Произошла ошибка при добавлении отметки3.', HttpStatus.BAD_REQUEST)
            
        let create_marks = 0
        for(let oper of tp.operations) {
            let kol = 0
            for(let mark of oper.marks) {
                kol = kol + mark.kol
            }
            if(objects.kolvo_shipments <= kol) create_marks++
        }
        if(create_marks >= tp.operations.length) {
            if(dto.assemble_id) objects.status = StatusAssemble[1]
            if(dto.metaloworking_id) objects.status = StatusMetaloworking[1]
        }
        await objects.save()
    }
}
