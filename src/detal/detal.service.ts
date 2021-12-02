import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isArray } from 'lodash';
import { Op } from 'sequelize';
import { Actions } from 'src/actions/actions.model';
import { Cbed } from 'src/cbed/cbed.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Equipment } from 'src/equipment/equipment.model';
import { RemoveDocumentDto } from 'src/files/dto/remove-document.dto';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { Product } from 'src/product/product.model';
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

    async getAllDetals(light: string) {
        if(light == 'false') return await this.detalReprository.findAll({include: {all: true}})
        return await this.detalReprository.findAll({ attributes: [
            'id', 'name', 'ban', 'articl', 'attention'
        ]})
    }

    async createNewDetal(dto: CreateDetalDto, files: any, authID: any) {
        let detal = await this.detalReprository.create({name: dto.name})
        if(!detal)
            throw new HttpException('Не удалось создать деталь', HttpStatus.BAD_REQUEST)
        detal = await this.detalReprository.findByPk(detal.id, {include: {all: true}})
        
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

    async addFileToDetal(dto: any) {
        if(!dto.files || !dto.detal_id)
            throw new HttpException('Не удалось добавить файлы к детали', HttpStatus.BAD_REQUEST)
        if(dto.files.length) {
            for(let file of dto.files) {
                let check_document = await this.documentsService.getFileById(file.id)
                if(check_document) {
                    check_document.$add('detal', dto.detal_id)
                    await check_document.save()
                }
            }
        }
    }

    async getDeleteById(id:number) {
        const detal = await this.detalReprository.findByPk(id, {include: [
            {all: true},
            {
                model: TechProcess, 
                include: ['operations']
            }
        ]})
        if(!detal) 
            throw new HttpException('Не удалось обновить деталь', HttpStatus.BAD_REQUEST)
            
        return detal
    }

    async getAllDetalArticl() {
        return await this.detalReprository.findAll({attributes: ['articl']})
    }

    async updateDetal(dto: UpdateDetalDto, files: any, authID: any) {
        const detal = await this.detalReprository.findByPk(dto.id, {include: {all: true}})
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

        if(dto.articl != 'null')
            detal.articl = dto.articl
            else detal.articl = 0
        if(dto.description != 'null')
            detal.description = dto.description
            else detal.description = ''
        if(dto.parametrs)
            detal.parametrs = dto.parametrs
        if(dto.haracteriatic)
            detal.haracteriatic = dto.haracteriatic
        if(dto.DxL != 'null')
            detal.DxL = dto.DxL
            else detal.DxL = 0
        if(dto.massZag != 'null')
            detal.massZag = dto.massZag
            else detal.massZag = 0
        if(dto.trash != 'null')
            detal.trash = dto.trash
            else detal.trash = 0
        detal.attention = dto.attention

        await detal.save()
        if(detal.materials && detal.materials.length) {
            for(let det of detal.materials) {
                await detal.$remove('materials', det.id)
            }
        }

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
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        mList[m].mat.name = material.name
                        await detal.$add('materials', material.id)
                    }
                }
                detal.materialList = JSON.stringify(mList)
            }
        } else 
            detal.materialList = ''   

        await detal.save()

        if(Number(dto.techProcessID)) {
            const tp = await this.techProcessReprository.findByPk(dto.techProcessID)
            if(tp) {
                tp.detalId = detal.id
                await tp.save()
            }
        }

        if(detal.documents) {
            for(let doc of detal.documents) {
                detal.$remove('documents', doc.id)
            }
        }
        
        if(dto.file_base && dto.file_base != '[]') {
            try {
                let pars = JSON.parse(dto.file_base)
                for(let file of pars) {
                    const check_files = await this.documentsService.getFileById(file)
                    if(check_files)
                        await detal.$add('documents', check_files)
                }
            }   catch(e) {
                console.error(e)
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
                    if(docId) {
                        await detal.$add('documents', docId.id)
                        await detal.save()
                    }
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

    private async upAndCreateOperation(dto: UpCreateOperationDto, files: any, operation: any) {
        if(dto.description != 'null')
            operation.description = dto.description
            else
                operation.description = ''
        if(dto.preTime)
            operation.preTime = dto.preTime
        if(dto.helperTime)
            operation.helperTime = dto.helperTime
        if(dto.mainTime)
            operation.mainTime = dto.mainTime
        if(dto.generalCountTime)
            operation.generalCountTime = dto.generalCountTime

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
            tp = await this.techProcessReprository.findByPk(dto.id, {include: {all: true}})
            description = 'Изменил технический процесс'
        }   else {
            let new_tp = await this.techProcessReprository.create()
            tp = await this.techProcessReprository.findByPk(new_tp.id, {include: {all: true}})
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
                if(res && res.id) {
                    const docId = await this.documentsReprository.findByPk(res.id)
                    if(docId) await tp.$add('documents', docId.id)
                }
                i++
            }
        }

        await tp.save()
        return tp
    }

    async getTechProcessById(id: number) {
        const tp = await this.techProcessReprository.findByPk(id, {include: [
            {all: true},
            {model: Detal, include: ['documents']},
            {model: Cbed, include: ['documents']},
            {model: Product, include: ['documents']}
        ]})

        if(!tp)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)
        if(tp.operations.length) {
            for(let inx = 0; inx < tp.operations.length; inx++) {
                if(tp.operations[inx].ban)
                    tp.operations.splice(inx, 1)
            }
        }
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

    async findByIdDetal(id: number) {
        return await this.detalReprository.findByPk(id, {include: { all: true }})
    }

    async removeDocumentDetal(dto: RemoveDocumentDto) {
        const detal = await this.detalReprository.findByPk(dto.id_object, {include: {all: true}})
        const document = await this.documentsService.getFileById(dto.id_document)

        if(detal && document) {
            detal.$remove('documents', document.id)
            await detal.save()
        }
        return detal
    }

    async getAllDeficitDeficit() {
		const detals = await this.detalReprository.findAll({include: {all: true}, where: {
            shipments_kolvo: {
                [Op.gt]: 0
            }
        }})
        return detals
	}

    async getDetalIncludeOperation() {
        const detal = await this.detalReprository.findAll({include: [{
            model: TechProcess, 
            include: [{all: true}]
        }]})
        
        let new_arr = []
        for(let det of detal) {
            if(!det.techProcesses || det.techProcesses.operations.length == 0) new_arr.push(det.id)
        }

        return new_arr
    }

}
