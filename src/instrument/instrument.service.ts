import { ConsoleLogger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { of } from 'rxjs';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Providers } from 'src/provider/provider.model';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { CreateNameInstrumentDto } from './dto/create-name-instrument.dto';
import { CreatePTInstrumentDto } from './dto/create-pt-instrument.dto';
import { UpdateTInstrumentDto } from './dto/update-instrument.dto';
import { UpdateNameInstrumentDto } from './dto/update-name-instrument.dto';
import { UpdatePTInstrumentDto } from './dto/update-pt.dto';
import { Instrument } from './instrument.model';
import { NameInstrument } from './name-instrument.model';
import { PInstrument } from './pt-instrument.model';
 
@Injectable()
export class InstrumentService {
    constructor(@InjectModel(Instrument) private instrReprository: typeof Instrument,
        @InjectModel(PInstrument) private pIReorository: typeof PInstrument, 
        @InjectModel(NameInstrument) private nameInastrumentReprository: typeof NameInstrument,
        private documentsService: DocumentsService,
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        @InjectModel(Providers) private providersReprository: typeof Providers,
    ) {}

    async createInstrument(dto: CreateInstrumentDto) {
        const instr = await this.instrReprository.create({name: dto.name, instans: dto.instans})
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
        instrument.instans = dto.instans
        await instrument.save()
        return instrument
    }

    async createPTInstrument(dto: CreatePTInstrumentDto) {
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

    async getPTInstrumentById(id: number) {
        const pInstrument = await this.pIReorository.findByPk(id, {include: {all: true}})
        if(pInstrument)
            return pInstrument
    }

    async getAllPInstrument() {
        return await this.pIReorository.findAll({include: {all: true}})
    }

    async createNameInstrument(dto: CreateNameInstrumentDto, files: any) {
        const nameInstrument = await this.nameInastrumentReprository.create({name: dto.name })
        if(!nameInstrument)
            throw new HttpException('Произошла ошибка при добавлении', HttpStatus.BAD_REQUEST)
        
        if(dto.description)
            nameInstrument.description = dto.description
        if(dto.deliveryTime)
            nameInstrument.deliveryTime = dto.deliveryTime
        if(dto.minOstatok)
            nameInstrument.minOstatok = dto.minOstatok
        if(dto.mountUsed)
            nameInstrument.mountUsed = dto.mountUsed

        if(dto.providers) {
            let providers = JSON.parse(dto.providers)
            for(let prx of providers) {
                let res = await this.providersReprository.findByPk(prx.id)
                if(res) 
                    nameInstrument.$add('providers', res.id)
            }
        }

        await nameInstrument.save()

        if(Number(dto.parentId)) {
            const pInstrument = await this.pIReorository.findByPk(dto.parentId)
            if(pInstrument) {
                await pInstrument.$add('nameInstrument', nameInstrument.id)
                await pInstrument.save()
            }
        }
        if(Number(dto.rootParentId)) {
            const instrument = await this.instrReprository.findByPk(dto.rootParentId)
            if(instrument) {
                nameInstrument.rootParentId = instrument.id
                await nameInstrument.save()
            }
        }

        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentsService.saveDocument(
                    document, 
                    docs[i].nameInstans, 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await nameInstrument.$add('documents', docId.id)
                }
                i++
            }
        }

        await nameInstrument.save()

        return nameInstrument
    }

    async updateNameInstrument(dto: UpdateNameInstrumentDto, files: any) {
        const nameInstrument = await this.nameInastrumentReprository.findByPk(dto.id)
        console.info(dto)
        if(!nameInstrument)
            throw new HttpException('Произошла ошибка при добавлении', HttpStatus.BAD_REQUEST)
        
        if(dto.name) 
            nameInstrument.name = dto.name
        if(dto.description)
            nameInstrument.description = dto.description
        if(dto.deliveryTime)
            nameInstrument.deliveryTime = dto.deliveryTime
        if(dto.minOstatok)
            nameInstrument.minOstatok = dto.minOstatok
        if(dto.mountUsed)
            nameInstrument.mountUsed = dto.mountUsed

        await nameInstrument.save()

        if(dto.providers) {
            nameInstrument.providers = []
            let providers = JSON.parse(dto.providers)
            for(let prx of providers) {
                let res = await this.providersReprository.findByPk(prx.id)
                if(res) 
                    nameInstrument.$add('providers', res.id)
            }
        }

        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentsService.saveDocument(
                    document, 
                    docs[i].nameInstans, 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await nameInstrument.$add('documents', docId.id)
                }
                i++
            }
        }

        await nameInstrument.save()

        return nameInstrument
    }

    async getNameInstrument(id: number) {
        const nameInstrument = await this.nameInastrumentReprository.findByPk(id, {include: {all: true}})
        if(nameInstrument) 
            return nameInstrument
    }

    async removeFileInstrument(id: number) {
        const document = await this.documentsReprository.findByPk(id)
        if(document) 
            await document.destroy()
    }

    async banNameInstrument(id: number) {
        const nameInstrument = await this.nameInastrumentReprository.findByPk(id)
        if(nameInstrument) {
            nameInstrument.ban = !nameInstrument.ban
            await nameInstrument.save()
        }
    }

    async getAllNameInstrument() {
        return await this.nameInastrumentReprository.findAll({include: {all: true}})
    }
}
