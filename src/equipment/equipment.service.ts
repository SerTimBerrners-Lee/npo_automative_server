import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EquipmentPType } from './equipment-pt.model';
import { EquipmentType } from './euipment-type.model';

@Injectable()
export class EquipmentService {

    constructor(@InjectModel(EquipmentType) private equipmentTypeReprository: typeof EquipmentType,
    @InjectModel(EquipmentPType) private equipemtnPTReprository: typeof EquipmentPType
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
            throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND)

        const equipmentPT = await this.equipemtnPTReprository.create({name: dto.name})
        if(!equipmentPT)
            throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND)
        
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
} 
