import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isArray } from 'lodash';
import { Actions } from 'src/actions/actions.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Equipment } from 'src/equipment/equipment.model';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { User } from 'src/users/users.model';
import { Detal } from './detal.model';
import { CreateDetalDto } from './dto/create-detal.dto';
import { CreateTypeOperation } from './dto/create-type-operation.dto';
import { UpCreateTechProcessDto } from './dto/up-create-tech-process.dto';
import { UpCreateOperationDto } from './dto/update-create-operation.dto';
import { UpdateDetalDto } from './dto/update-detal.dto';
import { UpOperationTechDto } from './dto/update-operation-tech.dto';
import { UpdateTypeOperation } from './dto/update-type-operation.dto';
import { Operation } from './operation.model';
import { TechProcess } from './tech-process.model';
import { TypeOperation } from './type-operation.model';

@Injectable()
export class DetalService {
    constructor(@InjectModel(Detal) private detalReprository: typeof Detal,
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
        @InjectModel(Operation) private operationReprository: typeof Operation,
        @InjectModel(NameInstrument) private nInstrumentReprository: typeof NameInstrument,
        @InjectModel(Equipment) private equipmentReprository: typeof Equipment,
        @InjectModel(TechProcess) private techProcessReprository: typeof TechProcess,
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Actions) private actionsReprository: typeof Actions,
        @InjectModel(TypeOperation) private typeOperationReprository: typeof TypeOperation,
        private documentsService: DocumentsService
    ) {} 

    async getAllDetals() {
        return await this.detalReprository.findAll({include: {all: true}})
    }

    async createNewDetal(dto: CreateDetalDto, files: any, authID: any) {
        const detal = await this.detalReprository.create({name: dto.name})
        if(!detal)
            throw new HttpException('Не удалось создать деталь', HttpStatus.BAD_REQUEST)
        
        const action = await this.actionsReprository.create({action: "Добавил детать"})
        let user: any
        if(authID)
            user = await this.userRepository.findByPk(authID)
        if(action) {
            action.detalId = detal.id
            if(user)
                action.responsibleId = user.id
            await action.save()
        }

        return await this.upCreateDetal(dto, files, detal)
    }

    async removeDeleteById(id: number, authId: any) {
        const detal = await this.detalReprository.findByPk(id)
        if(!detal) 
            throw new HttpException('Не удалось обновить деталь', HttpStatus.BAD_REQUEST)

        const action = await this.actionsReprository
            .create({action: detal.ban ? "Вернул деталь из арзива" : "Занес деталь в архив"})

        let user: any
        if(authId)
            user = await this.userRepository.findByPk(authId)
        if(action) {
            action.detalId = detal.id
            if(user)
                action.responsibleId = user.id
            await action.save()
        }
            
        detal.ban = !detal.ban
        await detal.save()
        return detal
    }

    async getDeleteById(id:number) {
        const detal = await this.detalReprository.findByPk(id, {include: {all: true}})
        if(!detal) 
            throw new HttpException('Не удалось обновить деталь', HttpStatus.BAD_REQUEST)
            
        return detal
    }

    async updateDetal(dto: UpdateDetalDto, files: any, authID: any) {
        const detal = await this.detalReprository.findByPk(dto.id)
        if(!detal)
            throw new HttpException('Не удалосьм обновить деталь', HttpStatus.BAD_REQUEST)

        const action = await this.actionsReprository.create({action: "Внес изменения в детать"})
        let user: any
        if(authID)
            user = await this.userRepository.findByPk(authID)
        if(action) {
            action.detalId = detal.id
            if(user)
                action.responsibleId = user.id
            await action.save()
        }
        
        detal.name = dto.name
        await detal.save()
        return await this.upCreateDetal(dto, files, detal)
    }

    private async upCreateDetal(dto: any, files: any, detal: any) {

        if(dto.articl)
            detal.articl = dto.articl
        if(dto.description)
            detal.description = dto.description
        if(dto.parametrs)
            detal.parametrs = dto.parametrs
        if(dto.haracteriatic)
            detal.haracteriatic = dto.haracteriatic
        if(dto.DxL)
            detal.DxL = dto.DxL
        if(dto.massZag)
            detal.massZag = dto.massZag
        if(dto.trash)
            detal.trash = dto.trash

        await detal.save()

        if(Number(dto.responsible)) {
            const user = await this.userRepository.findByPk(dto.responsible)
            if(user)
                detal.responsibleId = user.id
        }

        if(Number(dto.mat_zag)) {
            detal.mat_zag = dto.mat_zag
            let material = await this.podPodMaterialReprository.findByPk(dto.mat_zag)
            if(material) {
                await detal.$add('materials', material.id)
                detal.mat_zag = dto.mat_zag
                await detal.save()
            }
        }
        if(Number(dto.mat_zag_zam)) {
            detal.mat_zag_zam = dto.mat_zag_zam
            let material = await this.podPodMaterialReprository.findByPk(dto.mat_zag_zam)
            if(material) {
                await detal.$add('materials', material.id)
                detal.mat_zag_zam = dto.mat_zag_zam
                await detal.save()
            }
        }

        if(dto.materialList) {
            const mList = JSON.parse(dto.materialList)
            detal.materialList = dto.materialList
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        await detal.$add('materials', material.id)
                        await detal.save()
                    }
                }
            }
        }

        if(Number(dto.techProcessID)) {
            const tp = await this.techProcessReprository.findByPk(dto.techProcessID)
            if(tp) {
                await detal.$add('techProcesses', tp.id)
                await detal.save()
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
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await detal.$add('documents', docId.id)
                    await detal.save()
                }
                i++
            }
        }

        await detal.save()
        return detal
    } 

    async createNewOperation(dto: UpCreateOperationDto, files: any) {
        const operation = await this.operationReprository.create({name: dto.name})
        if(!operation) 
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)
        
        return await this.upAndCreateOperation(dto, files, operation)
    }

    async updateOperation(dto: UpCreateOperationDto, files: any) {
        const operation = await this.operationReprository.findByPk(dto.id)

        if(!operation)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)
        
        operation.name = dto.name
        await operation.save()

        return await this.upAndCreateOperation(dto, files, operation)
    }

    async getOneOperationById(id: number) {
        const operation = await this.operationReprository.findByPk(id, {include: {all: true}})
        if(id)
            return operation
    }

    private async upAndCreateOperation(dto: UpCreateOperationDto, files: any, operation: any) {
        if(dto.description)
            operation.description = dto.description
        if(dto.preTime)
            operation.preTime = dto.preTime
        if(dto.helperTime)
            operation.helperTime = dto.helperTime
        if(dto.mainTime)
            operation.mainTime = dto.mainTime
        if(dto.generalCountTime)
            operation.generalCountTime = dto.generalCountTime
            
        operation.tOperationId = operation.name
        
        // add instrument 
        operation.instruments = []
        await operation.save()

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

        // add equipments 
        operation.equipments = []
        await operation.save()

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
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await operation.$add('documents', docId.id)
                }
                i++
            }
        }

        await operation.save()

        return operation
    }

    async updateOperationTech(dto: UpOperationTechDto) {
        const operation = await this.operationReprository.findByPk(dto.id)
        if(!operation)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)

        operation.instrumentID      =     dto.instrumentID
        operation.instrumentMerID   =     dto.instrumentMerID
        operation.instrumentOsnID   =     dto.instrumentOsnID
        operation.eqID              =     dto.eqID

        await operation.save()

        return operation
    }

    async banOperation(id: number) {
        const operation = await this.operationReprository.findByPk(id)
        if(!operation)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)

        operation.ban = !operation.ban
        await operation.save()
        return operation.id
    }

    async createNewTechProcess(dto: UpCreateTechProcessDto, files: any) {

        let [tp, description]: any[] = [];

        if(Number(dto.id)) {
            tp = await this.techProcessReprository.findByPk(dto.id)
            description = 'Изменил технический процесс'
        }   else {
            tp = await this.techProcessReprository.create()
            description = 'Добавил технический процесс'
        } 

        const action = await this.actionsReprository.create({action: description})
        let user: any
        if(dto.responsibleActionId)
            user = await this.userRepository.findByPk(dto.responsibleActionId)
        if(action) {
            action.techProcessId = tp.id
            if(user)
                action.user = user.id
            await action.save()
        }

        if(!tp)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)

        if(dto.description)
            tp.description = dto.description

        tp.operations = []
        if(dto.operationList) {
            let OL = JSON.parse(dto.operationList)
            if(OL && OL.length) {
                for(let oper of OL) {
                    let o = await this.operationReprository.findByPk(oper.id)
                    if(o) {
                        await tp.$add('operations', o.id)
                        await tp.save()
                    }
                }
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
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await tp.$add('documents', docId.id)
                }
                i++
            }
        }

        await tp.save()
        return tp
    }

    async getTechProcessById(id: number) {
        const tp = await this.techProcessReprository.findByPk(id, {include: {all: true}})

        if(!tp)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)
        return tp
    }

    async createNewTypeOperation(dto: CreateTypeOperation) {
        if(!dto && !dto.name) 
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)
        const TO = await this.typeOperationReprository.create(dto)
        if(!TO)
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)
        return TO
        
    }

    async updateTypeOperation(dto: UpdateTypeOperation) {
        if(!dto && !dto.name) 
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)
        const TO = await this.typeOperationReprository.findByPk(dto.id)
        if(!TO)
            throw new HttpException('Не удалось сохранить тип операции', HttpStatus.BAD_REQUEST)
        await TO.update(dto)
        
        return TO
        
    }

    async getAllTypeOperation() {
        return await this.typeOperationReprository.findAll({include: {all: true}})
    }

    async deleteTypeOperationById(id: any) {
        const TO = await this.typeOperationReprository.findByPk(id.id)
        if(!TO)
            throw new HttpException('Не удалось удалить тип операции', HttpStatus.BAD_REQUEST)
        return await this.typeOperationReprository.destroy({where: {id: TO.id}})
    }
}
