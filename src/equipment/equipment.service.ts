import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { Providers } from 'src/provider/provider.model';
import { User } from 'src/users/users.model';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentPType } from './equipment-pt.model';
import { Equipment } from './equipment.model';
import { EquipmentType } from './euipment-type.model';

@Injectable()
export class EquipmentService {

    constructor(
        @InjectModel(EquipmentType) private equipmentTypeReprository: typeof EquipmentType,
        @InjectModel(EquipmentPType) private equipemtnPTReprository: typeof EquipmentPType,
        @InjectModel(Equipment) private equipmentReprository: typeof Equipment,
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        @InjectModel(Providers) private providersReprository: typeof Providers,
        @InjectModel(NameInstrument) private nameInstrumentReprository: typeof NameInstrument,
        @InjectModel(User) private userRepository: typeof User,
        private documentsService: DocumentsService, 
    ) {}

    async createEquipmentType(dto: any) {
        const equipment = await this.equipmentTypeReprository.create({name: dto.name})
        if(!equipment)
           throw new HttpException('Произошла ошибка придобавлении', HttpStatus.BAD_REQUEST)

        return equipment 
    }

    async getAllEquipmentType() {
        const equipment = await this.equipmentTypeReprository.findAll({include: {all: true}})
        if(equipment)
            return equipment
    }

    async removeEquipmentType(id: number) {
        const equipment = await this.equipmentTypeReprository.findByPk(id) 
        if(equipment)
            await this.equipmentTypeReprository.destroy({where: {id}})

        return equipment
    }

    async updateEquipmentType(dto: any) {
        const equipment = await this.equipmentTypeReprository.findByPk(dto.id)
        if(!equipment)
            throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND)
        equipment.name = dto.name
        await equipment.save()
        return equipment
    }

    async createEquipmentPType(dto: any) {
        const equipment = await this.equipmentTypeReprository.findByPk(dto.parentId)
        if(!equipment)
            throw new HttpException('Запись не найдена', HttpStatus.BAD_REQUEST)

        const equipmentPT = await this.equipemtnPTReprository.create({name: dto.name})
        if(!equipmentPT)
            throw new HttpException('Запись не найдена', HttpStatus.BAD_REQUEST)
        
        await equipment.$add('equipmentsPT', equipmentPT.id)
        await equipment.save()
        return equipmentPT
    }

    async updateEquipmentPType(dto: any) {
        const equpmentPT = await this.equipemtnPTReprository.findByPk(dto.id)
        if(!equpmentPT)
            throw new HttpException('Ошибка при обновлении подтипа материала', HttpStatus.NOT_FOUND)
        
        equpmentPT.name = dto.name
        await equpmentPT.save()
        return equpmentPT
    }

    async removeEquipmentPType(id: number) {
        const eq = await this.equipemtnPTReprository.findByPk(id)
        if(!eq)
            throw new HttpException('Ошибка при обновлении подтипа материала', HttpStatus.NOT_FOUND)
        
        await this.equipemtnPTReprository.destroy({where: {id}})
        return true
    }

    async getOneEquipmentPType(id: number) {
        const equipmentPT = await this.equipemtnPTReprository.findByPk(id, {include: {all: true}})
        if(equipmentPT)
            return equipmentPT
    }

    async getAllEquipmentPType() {
        return await this.equipemtnPTReprository.findAll({include: {all: true}})
    }

    async createEquipment(dto: CreateEquipmentDto, files: any) {
        const equipment = await this.equipmentReprository.create({name: dto.name })
        if(!equipment)
            throw new HttpException('Произошла ошибка при добавлении', HttpStatus.BAD_REQUEST)
        
        if(dto.description != 'null')
            equipment.description = dto.description
            else
                equipment.description = ''
        if(dto.deliveryTime != 'null')
            equipment.deliveryTime = dto.deliveryTime
            else
                equipment.deliveryTime = ''
        if(dto.invNymber != 'null')
            equipment.invNymber = dto.invNymber
            else
                equipment.invNymber = ''
         if(dto.responsible) {
            const user = await this.userRepository.findByPk(dto.responsible)
            if(user) 
                equipment.responsibleId = user.id
        }  
        
        await equipment.save()

        if(dto.providers) {
            let providers = JSON.parse(dto.providers)
            for(let prx of providers) {
                let res = await this.providersReprository.findByPk(prx.id)
                if(res) 
                    equipment.$add('providers', res.id)
            }
        }
        await equipment.save()

        if(Number(dto.parentId)) {
            const equipmentPT = await this.equipemtnPTReprository.findByPk(dto.parentId)
            if(equipmentPT) {
                await equipmentPT.$add('equipments', equipment.id)
                await equipmentPT.save()
            }
        }

        if(Number(dto.rootParentId)) {
            const equipmentType = await this.equipmentTypeReprository.findByPk(dto.rootParentId)
            if(equipmentType) {
                equipment.rootParentId = equipmentType.id
                await equipment.save()
            }
        }

        let instrumentIdList: any
        
        if(dto.instrumentIdList)
            instrumentIdList = JSON.parse(dto.instrumentIdList)
        if(instrumentIdList && instrumentIdList.length > 0) {
            for(let inst of instrumentIdList) {
                let nameInstrument = await this.nameInstrumentReprository.findByPk(inst)
                if(nameInstrument) {
                    equipment.$add('nameInstrument', nameInstrument.id)
                    await equipment.save()
                }
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
                if(res && res.id) {
                    const docId = await this.documentsReprository.findByPk(res.id)
                    if(docId) await equipment.$add('documents', docId.id)
                }
                i++
            }
        }

        await equipment.save()

        return equipment
    } 

    async updateEquipmqnt(dto: UpdateEquipmentDto, files: any) {
        const equipment = await this.equipmentReprository.findByPk(dto.id, {include: {all: true}})
        if(!equipment)
            throw new HttpException('Произошла ошибка при добавлении', HttpStatus.BAD_REQUEST)
        
        if(dto.description != 'null')
            equipment.description = dto.description
            else
                equipment.description = ''
        if(dto.deliveryTime != 'null')
            equipment.deliveryTime = dto.deliveryTime
            else
                equipment.deliveryTime = ''
        if(dto.invNymber != 'null')
            equipment.invNymber = dto.invNymber
            else
                equipment.invNymber = ''
        if(dto.name)
            equipment.name = dto.name

        if(dto.responsible) {
            const user = await this.userRepository.findByPk(dto.responsible)
            if(user) 
                equipment.responsibleId = user.id
        }

        await equipment.save()

        if(dto.providers) {
            equipment.providers = []
            let providers = JSON.parse(dto.providers)
            for(let prx of providers) {
                let res = await this.providersReprository.findByPk(prx.id)
                if(res) 
                    equipment.$add('providers', res.id)
            }
        }

        let instrumentIdList: any
        
        for(let eq of equipment.nameInstrument){
            await equipment.$remove('nameInstrument', eq.id) 
            await equipment.save()
        }

        if(dto.instrumentIdList)
            instrumentIdList = JSON.parse(dto.instrumentIdList)
        if(instrumentIdList && instrumentIdList.length > 0) {
            for(let inst of instrumentIdList) {
                let nameInstrument = await this.nameInstrumentReprository.findByPk(inst)
                if(nameInstrument) {
                    equipment.$add('nameInstrument', nameInstrument.id)
                    await equipment.save()
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
                    if(docId) await equipment.$add('documents', docId.id)
                }
                i++
            }
        }

        await equipment.save()

        return equipment
    }
    async getOneEquipment(id: number) {
        const eq = await this.equipmentReprository.findByPk(id, {include: {all: true}})
        if(!eq)
            throw new HttpException('Не удалось найти оборудование',HttpStatus.NOT_FOUND)
        return eq
    }

    async removeFileEquipment(id: number) {
        const document = await this.documentsReprository.findByPk(id)
        if(document) 
            await document.destroy()
    }

    async banEquipment(id: number) {
        const equipment = await this.equipmentReprository.findByPk(id)
        if(equipment) {
            equipment.ban = !equipment.ban
            await equipment.save()
        }
    }

    async getAllEquipment() {
        return await this.equipmentReprository.findAll()
    }

    async attachFileToEquipment(eq_id: number, file_id: number) {
        const equipment = await this.equipmentReprository.findByPk(eq_id)
        const file = await this.documentsService.getFileById(file_id)

        if(equipment && file) 
            equipment.$add('documents', file.id)

        return file
    }
} 
