import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { of } from 'rxjs';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { CreatePTInstrumentDto } from './dto/create-pt-instrument.dto';
import { UpdateTInstrumentDto } from './dto/update-instrument.dto';
import { UpdatePTInstrumentDto } from './dto/update-pt.dto';
import { Instrument } from './instrument.model';
import { PInstrument } from './pt-instrument.model';

@Injectable()
export class InstrumentService {
    constructor(@InjectModel(Instrument) private instrReprository: typeof Instrument,
        @InjectModel(PInstrument) private pIReorository: typeof PInstrument
    ) {}

    async createInstrument(dto: CreateInstrumentDto) {
        const instr = await this.instrReprository.create({name: dto.name})
        if(!instr)
           throw new HttpException('Произошла ошибка придобавлении', HttpStatus.BAD_REQUEST)

        return instr 
    }

    async getAllTInstrument() {
        const instruments = await this.instrReprository.findAll({include: {all: true}})
        if(instruments)
            return instruments
    }

    async removeTInstrument(id: number) {
        const instrument = await this.instrReprository.findByPk(id) 
        if(instrument)
            await this.instrReprository.destroy({where: {id}})

        return instrument
    }

    async updateTInstrument(dto: UpdateTInstrumentDto) {
        const instrument = await this.instrReprository.findByPk(dto.id)
        if(!instrument)
            throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND)
        instrument.name = dto.name
        await instrument.save()
        return instrument
    }

    async createPTInstrument(dto: CreatePTInstrumentDto) {
        console.log(dto)
        const pInstrument = await this.pIReorository.create({name: dto.name})
        if(!pInstrument)
            throw new HttpException('Ошибка при создании подтипа', HttpStatus.BAD_REQUEST)
        
        if(dto.parentId) {
            const instrument = await this.instrReprository.findByPk(dto.parentId)
            if(instrument) {
                await instrument.$add('pInstruments', pInstrument.id)
                await instrument.save()
            }
        }

        return pInstrument
    }

    async removePTInstrument(id: number) {
        const pInstrument = await this.pIReorository.findByPk(id)
        if(!pInstrument)
            throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND)
        await this.pIReorository.destroy({where: {id: pInstrument.id}})
        return pInstrument
    }

    async updatePTInstrument(dto: UpdatePTInstrumentDto) {
        const pInstrument = await this.pIReorository.findByPk(dto.id)
        if(!pInstrument)
            throw new HttpException('Ошибка при обновлении подтипа материала', HttpStatus.NOT_FOUND)
        
        pInstrument.name = dto.name
        await pInstrument.save()
        return pInstrument
    }
}
