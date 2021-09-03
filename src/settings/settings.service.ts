import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { where } from 'sequelize';
import { CreateEdizmDto } from './dto/create-edizm.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { CreateTypeEdizmDto } from './dto/create-type-edizm.dto';
import { UpdateEdizmDto } from './dto/update-edizm.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Edizm } from './edizm.model';
import { Material } from './material.model';
import { TypeEdizm } from './type-edizm.model';

@Injectable()
export class SettingsService {
    constructor(@InjectModel(TypeEdizm) private typeEdizmReprositoy: typeof TypeEdizm,
        @InjectModel(Edizm) private edizmReprository: typeof Edizm,
        @InjectModel(Material) private materialReprository: typeof Material
    ) {}

    async createTypeEdizm(dto: CreateTypeEdizmDto) {
        return this.typeEdizmReprositoy.create(dto)
    }

    async createEdizm(dto: CreateEdizmDto) {
        return this.edizmReprository.create(dto)
    }
    

    async getAllEdizm() {
        const edizm = await this.edizmReprository.findAll()
        return edizm;
    }

    async getAllTypeEdizm() {
        const eType = await this.typeEdizmReprositoy.findAll()
        return eType
    }

    async deleteEdizmById(id: number) {
        const edizm = await this.edizmReprository.findByPk(id)
        if(edizm)
            return await this.edizmReprository.destroy({where: {id}})
        return edizm
    }

    async updateEdizmById(dto: UpdateEdizmDto) {
        const edizm = await this.edizmReprository.findByPk(dto.id)
        if(!edizm)
            throw new HttpException('Единица измерения не найдена', HttpStatus.NOT_FOUND)
        
        edizm.name = dto.name
        edizm.short_name = dto.short_name
        await edizm.save()
        return edizm
    }

    async getAllTypeMaterial() {
        const materials = await this.materialReprository.findAll()
        return materials
    }

    async createMaterial(dto: CreateMaterialDto) {
        const material = await this.materialReprository.create({name: dto.name})
        if(!material)
            throw new HttpException('', HttpStatus.BAD_REQUEST)

        const updateMat = await this.createOrUpdateMaterial(dto, material.id)
        return updateMat
    }
    
    async updateMaterial(dto: UpdateMaterialDto) {
        const material = await this.materialReprository.findByPk(dto.id)
        if(!material)
            throw new HttpException('Материал не найден', HttpStatus.NOT_FOUND)

        const update = await this.createOrUpdateMaterial(dto, dto.id, true)
        return update
    }

    async removeMaterial(id: number) {
        const material = await this.materialReprository.findByPk(id)
        if(!material)
            throw new HttpException('Материал не найден', HttpStatus.NOT_FOUND)
        const result = await this.materialReprository.destroy( {where: {id} } )
        return result
    }
    

    async createOrUpdateMaterial(dto: CreateMaterialDto, id: number, update: boolean = false) {
        const material = await this.materialReprository.findByPk(id)
        if(!material)
            throw new HttpException('', HttpStatus.BAD_REQUEST)

        let [length_ez, 
            width_ez, 
            height_ez, 
            wallThickness_ez, 
            outsideDiametr_ez, 
            thickness_ez, 
            areaCrossSectional_ez]: any[] = []

        if(update)
            material.name = dto.name

        if(dto.length && dto.length['edizmId'] && dto.length['znach']) {
            if(length_ez = await this.edizmReprository.findByPk(dto.length['edizmId']))
                material.length = [{edizmId: length_ez, znach: dto.length['znach']}]
        } else 
            material.length = null
        if(dto.width && dto.width['edizmId'] && dto.width['znach']) {
            if(width_ez = await this.edizmReprository.findByPk(dto.width['edizmId'])) 
                material.width = [{edizmId: width_ez, znach: dto.width['znach']}]
        } else 
            material.width = null
        if(dto.height && dto.height['edizmId'] && dto.height['znach']) {
            if(height_ez = await this.edizmReprository.findByPk(dto.height['edizmId']))
                material.height = [{edizmId: height_ez, znach: dto.height['znach']}]
        } else 
            material.height = null
        if(dto.wallThickness && dto.wallThickness['edizmId'] && dto.wallThickness['znach']) {
            if(wallThickness_ez = await this.edizmReprository.findByPk(dto.wallThickness['edizmId']))
                material.wallThickness = [{edizmId: wallThickness_ez, znach: dto.wallThickness['znach']}]
        } else 
            material.wallThickness = null
        if(dto.outsideDiametr && dto.outsideDiametr['edizmId'] && dto.outsideDiametr['znach']) {
            if(outsideDiametr_ez = await this.edizmReprository.findByPk(dto.outsideDiametr['edizmId']))
                material.outsideDiametr = [{edizmId: outsideDiametr_ez, znach: dto.outsideDiametr['znach']}]
        } else 
            material.outsideDiametr = null
        if(dto.thickness && dto.thickness['edizmId'] && dto.thickness['znach']) {
            if(thickness_ez = await this.edizmReprository.findByPk(dto.thickness['edizmId']))
                material.thickness = [{edizmId: thickness_ez, znach: dto.thickness['znach']}]
        } else 
            material.thickness = null
        if(dto.areaCrossSectional && dto.areaCrossSectional['edizmId'] && dto.areaCrossSectional['znach']) {
            if(areaCrossSectional_ez = await this.edizmReprository.findByPk(dto.areaCrossSectional['edizmId']))
                material.areaCrossSectional = [{edizmId: areaCrossSectional_ez, znach: dto.areaCrossSectional['znach']}]
        } else 
            material.areaCrossSectional = null
            
        await material.save()

        return material
    }
}
