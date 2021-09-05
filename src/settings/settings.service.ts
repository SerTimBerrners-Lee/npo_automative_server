import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { where } from 'sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { CreateEdizmDto } from './dto/create-edizm.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { CreatePodMaterialDto } from './dto/create-pod-material.dto';
import { CreatePodPodMaterial } from './dto/create-pod-pod-material.dto';
import { CreateTypeEdizmDto } from './dto/create-type-edizm.dto';
import { UpdateEdizmDto } from './dto/update-edizm.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Edizm } from './edizm.model';
import { Material } from './material.model';
import { PodMaterial } from './pod-material.model';
import { PodPodMaterial } from './pod-pod-material.model';
import { TypeEdizm } from './type-edizm.model';

@Injectable()
export class SettingsService {
    constructor(@InjectModel(TypeEdizm) private typeEdizmReprositoy: typeof TypeEdizm,
        @InjectModel(Edizm) private edizmReprository: typeof Edizm,
        @InjectModel(Material) private materialReprository: typeof Material,
        @InjectModel(PodMaterial) private podMaterialReprository: typeof PodMaterial,
        @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
        private documentsService: DocumentsService
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
        const materials = await this.materialReprository.findAll({include: {all: true}})
        return materials
    }

    async getAllPodTypeMaterial() {
        const materials = await this.podMaterialReprository.findAll({include: {all: true}})
        return materials
    }

    async createMaterial(dto: CreateMaterialDto) {
        const material = await this.materialReprository.create({name: dto.name})
        if(!material)
            throw new HttpException('Произошла проблема при запросе к базе данных', HttpStatus.BAD_REQUEST)

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

    async createOrUpdateMaterial(dto: CreateMaterialDto, id: number, update: boolean = false, type: string = 'material') {
        let material: any
        if(type == 'material') {
            material = await this.materialReprository.findByPk(id)
        } else if(type == 'podPodMaterial') {
            material = await this.podPodMaterialReprository.findByPk(id)
        }
        if(!material)
            throw new HttpException('Произошла проблема при запросе к базе данных', HttpStatus.BAD_REQUEST)

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

    async createPodMaterial(dto: CreatePodMaterialDto) {
        const material = await this.materialReprository.findByPk(dto.materialId)
        if(!material)
            throw new HttpException('Материал не найден', HttpStatus.NOT_FOUND)

        const pod_material = await this.podMaterialReprository.create({name: dto.name})
        if(!pod_material)
            throw new HttpException('Произошла проблема при создании материала', HttpStatus.BAD_REQUEST)
        
        if(dto.density && dto.density['edizmId']) {
            let edizm = await this.edizmReprository.findByPk(dto.density['edizmId'])
            if(edizm)
                pod_material.density = [{edizmId: edizm, znach: dto.density['znach']}]
        }
        await pod_material.save()
        await material.$add('podMaterials', pod_material.id)
        await material.save()
    
        return pod_material
    }

    async removePodMaterial(id: number) {
        const result =  this.podMaterialReprository.destroy({where: {id}})
        console.log(result)
        return result
    }

    async updatePodTypeMaterial(dto: CreatePodMaterialDto) {
        const pod_material = await this.podMaterialReprository.findByPk(dto.materialId)
        if(!pod_material)
            throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND)

        if(dto.density && dto.density['edizmId']) {
            let edizm = await this.edizmReprository.findByPk(dto.density['edizmId'])
            if(edizm)
                pod_material.density = [{edizmId: edizm, znach: dto.density['znach']}]
        } else {
            pod_material.density = null
        }
        pod_material.name = dto.name
        await pod_material.save()

        return pod_material
    }

    async createAndUpdatePodPodMaterial(dto: CreatePodPodMaterial, files: any) {
        let podPodMaterial: any
        console.log(dto)
        if(typeof dto.id == 'number') {
            podPodMaterial = await this.podPodMaterialReprository.findByPk(dto.id)
        } else {
            podPodMaterial = await this.podPodMaterialReprository.create({ name: dto.name})
        }
        
        const podMaterials = await this.podMaterialReprository.findByPk(dto.podTypeId)
        if(!podPodMaterial || !podMaterials) 
            throw new HttpException('Не удалось создать запись ', HttpStatus.BAD_REQUEST)
  
        podPodMaterial.edizmId = dto.edizmId
        if(dto.description)
                podPodMaterial.description = dto.description

        let [deliveryTime, metrMass, deliveryTime_ez, metrMass_ez]: any[] = []

        deliveryTime = JSON.parse(dto.deliveryTime)
        metrMass = JSON.parse(dto.metrMass)

        if(deliveryTime && deliveryTime.edizmId && deliveryTime.znach) {
            if(deliveryTime_ez = await this.edizmReprository.findByPk(deliveryTime.edizmId))
                podPodMaterial.deliveryTime = [{edizmId: deliveryTime_ez, znach: deliveryTime.znach}]
        } else 
            podPodMaterial.deliveryTime = null
        if(metrMass && metrMass.edizmId && metrMass.znach) {
            if(metrMass_ez = await this.edizmReprository.findByPk(metrMass.edizmId ))
                podPodMaterial.metrMass = [{edizmId: metrMass_ez, znach: metrMass.znach}]
        } else 
            podPodMaterial.metrMass = null

        // let updatePodPodMaterial : any
        // typeof dto.id != 'number' ?
        //     updatePodPodMaterial = await this.createOrUpdateMaterial(dto, podPodMaterial.id, false, 'podPodMaterial')
        //     :
        //     updatePodPodMaterial = await this.createOrUpdateMaterial(dto, podPodMaterial.id, true, 'podPodMaterial' )

        if(typeof dto.id != 'number') {
            await podMaterials.$add('podPodMaterials', podPodMaterial.id)
            await podMaterials.save() 
        }   

        if(dto.docs) {
            console.log(Object.values(JSON.parse(dto.docs)))
            let docs = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentsService.saveDocument(
                    document, 
                    // docs[i].nameInstans, 
                    // docs[i].type,
                    // docs[i].version,
                    // docs[i].description,
                    // docs[i].name
                )
                console.log(res.id)
                console.log(res)
                i++
            }
        }

        await podPodMaterial.save()

        return podPodMaterial
    }

    async getPodPodMaterial() {
        const podPodMaterial = this.podPodMaterialReprository.findAll({include: {all: true}})
        return podPodMaterial
    }

    async getPodMaterialById(id: number) {
        const podMaterial = this.podMaterialReprository.findByPk(id, {include: {all:true}})
        return podMaterial 
    }

    async removePPMById(id: number) {
        const PPM = await this.podPodMaterialReprository.findByPk(id)
        if(PPM)
            return await this.podPodMaterialReprository.destroy({where: {id}})
    }

    async banPPMById(id: number) {
        const PPM = await this.podPodMaterialReprository.findByPk(id)
        if(PPM) {
            PPM.ban = !PPM.ban 
            await PPM.save()
            return PPM
        }
            
    }
}
