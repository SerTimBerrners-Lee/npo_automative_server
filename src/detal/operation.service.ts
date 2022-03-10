import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isArray } from 'lodash';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Equipment } from 'src/equipment/equipment.model';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { CreateTypeOperation } from './dto/create-type-operation.dto';
import { UpCreateOperationDto } from './dto/update-create-operation.dto';
import { UpOperationTechDto } from './dto/update-operation-tech.dto';
import { UpdateTypeOperation } from './dto/update-type-operation.dto';
import { Operation } from './operation.model';
import { TypeOperation } from './type-operation.model';

@Injectable()
export class OperationService {
    constructor( @InjectModel(Documents) private documentsReprository: typeof Documents,
        @InjectModel(Operation) private operationReprository: typeof Operation,
        @InjectModel(NameInstrument) private nInstrumentReprository: typeof NameInstrument,
        @InjectModel(Equipment) private equipmentReprository: typeof Equipment,
        @InjectModel(TypeOperation) private typeOperationReprository: typeof TypeOperation,
        private documentsService: DocumentsService
    ) {} 

    async getAllTypeOperation() {
      return await this.typeOperationReprository.findAll({order: [
          ['id', 'ASC'] 
      ]})
    }

    async createNewOperation(dto: UpCreateOperationDto, files: any) {
        const operation = await this.operationReprository.create({name: dto.name})
        if(!operation) 
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)
        
        return await this.upAndCreateOperation(dto, files, operation)
    }

    async updateOperation(dto: UpCreateOperationDto, files: any) {
        const operation = await this.operationReprository.findByPk(dto.id, {include: {all:true}})
        if(!operation)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)

        return await this.upAndCreateOperation(dto, files, operation)
    }

    async getOneOperationById(id: number) {
        return await this.operationReprository.findByPk(id, {include: {all: true}})
    }

    async getAllOperation() {
        return await this.operationReprository.findAll({include: {all:true}})
    }

    async banOperation(id: number) {
        const operation = await this.operationReprository.findByPk(id)
        if(!operation)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)

        operation.ban = !operation.ban
        await operation.save()
        return operation.id
    }

    async updateOperationTech(dto: UpOperationTechDto) {
        const operation = await this.operationReprository.findByPk(dto.id)
        if(!operation)
            throw new HttpException('Не удалось обновить операцию', HttpStatus.BAD_REQUEST)

        operation.instrumentID      =     dto.instrumentID
        operation.instrumentMerID   =     dto.instrumentMerID
        operation.instrumentOsnID   =     dto.instrumentOsnID
        operation.eqID              =     dto.eqID

        await operation.save()
        return operation
    }

    async updateTypeOperation(dto: UpdateTypeOperation) {
        if(!dto && !dto.name) 
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)
        const TO = await this.typeOperationReprository.findByPk(dto.id)
        if(!TO)
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)

        if(dto.square) {
            const square_select = await this.typeOperationReprository.findOne({where: {square: true}})
            if(square_select && TO.id !== square_select.id) {
                square_select.square = false
                await square_select.save()
            }
        }

        if(dto.list) {
            const square_select = await this.typeOperationReprository.findOne({where: {list: true}})
            if(square_select && TO.id !== square_select.id) {
                square_select.list = false
                await square_select.save()
            }
        }

        await TO.update(dto)
        return TO
    }

    async deleteTypeOperationById(id: any) {
        const TO = await this.typeOperationReprository.findByPk(id.id)
        if(!TO)
            throw new HttpException('Не удалось удалить тип операции', HttpStatus.BAD_REQUEST)
        return await this.typeOperationReprository.destroy({where: {id: TO.id}})
    }

    async createNewTypeOperation(dto: CreateTypeOperation) {
        if(!dto && !dto.name) 
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)
        const TO = await this.typeOperationReprository.create(dto)
        if(!TO)
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)
        return TO
    }

    private async upAndCreateOperation(dto: UpCreateOperationDto, files: any, operation: any) {
        if(dto.description != 'null')
            operation.description = dto.description
            else operation.description = ''
        if(dto.preTime) operation.preTime = dto.preTime
        if(dto.helperTime) operation.helperTime = dto.helperTime
        if(dto.mainTime) operation.mainTime = dto.mainTime
        if(dto.generalCountTime) operation.generalCountTime = dto.generalCountTime

        if(operation.name && !operation.tOperationId) {
            const tp = await this.typeOperationReprository.findByPk(operation.name)
            if(tp) {
                if(!operation.tOperationId) {
                    operation.tOperationId = tp.id
                    operation.full_name = tp.name
                }
            }
        }

        operation.instruments = []

        let instL: any;
        operation.instrumentList = null
        if(dto.instrumentList) { 
            instL = JSON.parse(dto.instrumentList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let instruments = await this.nInstrumentReprository.findByPk(instL[i].id)
                    if(instruments) {
                        operation.instrumentID = instruments.id
                        await operation.$add('instruments', instruments.id)
                        await operation.save()
                    }
                } 
                operation.instrumentList = dto.instrumentList
            }
        }

        operation.instrumentMerList = null
        if(dto.instrumentMerList) {
            instL = JSON.parse(dto.instrumentMerList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let instruments = await this.nInstrumentReprository.findByPk(instL[i].id)
                    if(instruments) {
                        operation.instrumentMerID = instruments.id
                        await operation.$add('instruments', instruments.id)
                        await operation.save()
                    }
                }
                operation.instrumentMerList = dto.instrumentMerList
            } 
        }

        operation.instrumentOsnList = null
        if(dto.instrumentOsnList) {
            instL = JSON.parse(dto.instrumentOsnList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let instruments = await this.nInstrumentReprository.findByPk(instL[i].id)
                    if(instruments) {
                        operation.instrumentOsnID = instruments.id
                        await operation.$add('instruments', instruments.id)
                        await operation.save()
                    }
                }
                operation.instrumentOsnList = dto.instrumentOsnList
            }
        }

        operation.equipments = []

        operation.eqList = null
        if(dto.eqList) {
            instL = JSON.parse(dto.eqList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let eq = await this.equipmentReprository.findByPk(instL[i].id)
                    if(eq) {
                        operation.eqID = eq.id
                        await operation.$add('equipments', eq.id)
                        await operation.save()
                    }
                }
                operation.eqList = dto.eqList
            }
        }

        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentsService.saveDocument(
                    document, 
                    'p', 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res && res.id) {
                    const docId = await this.documentsReprository.findByPk(res.id)
                    if(docId) await operation.$add('documents', docId.id)
                }
                i++
            }
        }

        await operation.save()

        return operation
    }

}
