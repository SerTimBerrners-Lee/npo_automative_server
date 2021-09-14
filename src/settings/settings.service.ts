import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Providers } from 'src/provider/provider.model';
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
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        private documentsService: DocumentsService,
        @InjectModel(Providers) private providersReprository: typeof Providers,
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
        // Проверяем типы если их нет - создаем
        let types = await this.typeEdizmReprositoy.findOne({where: {name: 'Экономические единицы'}})
        if(!types)
            await this.typeEdizmReprositoy.create({name: 'Экономические единицы'})
        types = await this.typeEdizmReprositoy.findOne({where: {name: 'Единицы времени'}})
        if(!types)
            await this.typeEdizmReprositoy.create({name: 'Единицы времени'})
        types = await this.typeEdizmReprositoy.findOne({where: {name: 'Технические единицы'}})
        if(!types)
            await this.typeEdizmReprositoy.create({name: 'Технические единицы'})
        types = await this.typeEdizmReprositoy.findOne({where: {name: 'Единицы массы'}})
        if(!types)
            await this.typeEdizmReprositoy.create({name: 'Единицы массы'})
        types = await this.typeEdizmReprositoy.findOne({where: {name: 'Единицы объема'}})
        if(!types)
            await this.typeEdizmReprositoy.create({name: 'Единицы объема'})
        types = await this.typeEdizmReprositoy.findOne({where: {name: 'Единицы площади'}})
        if(!types)
        await this.typeEdizmReprositoy.create({name: 'Единицы площади'})
        types = await this.typeEdizmReprositoy.findOne({where: {name: 'Единицы длины (Длина L Ширина A Высота B)'}})
        if(!types)
            await this.typeEdizmReprositoy.create({name: 'Единицы длины (Длина L Ширина A Высота B)'})
        types = await this.typeEdizmReprositoy.findOne({where: {name: 'Количественные единицы'}})
        if(!types)
            await this.typeEdizmReprositoy.create({name: 'Количественные единицы'})

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
        
        if(dto.instansMaterial) {
            material.instansMaterial = dto.instansMaterial
            await material.save()
        }

        const updateMat = await this.createOrUpdateMaterial(dto, material.id)
        return updateMat
    }
    
    async updateMaterial(dto: UpdateMaterialDto) {
        const material = await this.materialReprository.findByPk(dto.id)
        if(!material)
            throw new HttpException('Материал не найден', HttpStatus.NOT_FOUND)
        
        material.name = dto.name
        await material.save()

        const update = await this.createOrUpdateMaterial(dto, dto.id)
        return update
    }

    async removeMaterial(id: number) {
        const material = await this.materialReprository.findByPk(id)
        if(!material)
            throw new HttpException('Материал не найден', HttpStatus.NOT_FOUND)
        const result = await this.materialReprository.destroy( {where: {id} } )
        return result
    }

    async createOrUpdateMaterial(dto: CreateMaterialDto, id: number) {
        const material = await this.materialReprository.findByPk(id)
        if(!material)
            throw new HttpException('Произошла проблема при запросе к базе данных', HttpStatus.BAD_REQUEST)

        if(dto.length && dto.length.znach) {
            material.length = JSON.stringify({"edizm": dto.length.edizm, "znach": dto.length.znach})
        } else 
            material.length = null
        if(dto.width && dto.width.znach) {
            material.width = JSON.stringify({"edizm": dto.width.edizm, "znach": dto.width.znach})
        } else 
            material.width = null
        if(dto.height && dto.height.znach) {
            material.height = JSON.stringify({"edizm": dto.height.edizm, "znach": dto.height.znach})
        } else 
            material.height = null
        if(dto.wallThickness && dto.wallThickness.znach) {
            material.wallThickness = JSON.stringify({"edizm": dto.wallThickness.edizm, znach: dto.wallThickness.znach})
        } else 
            material.wallThickness = null
        if(dto.outsideDiametr && dto.outsideDiametr.znach) {
            material.outsideDiametr = JSON.stringify({"edizm": dto.outsideDiametr.edizm, "znach": dto.outsideDiametr.znach})
        } else 
            material.outsideDiametr = null
        if(dto.thickness && dto.thickness.znach) {
            material.thickness = JSON.stringify({"edizm": dto.thickness.edizm, "znach": dto.thickness.znach})
        } else 
            material.thickness = null
        if(dto.areaCrossSectional && dto.areaCrossSectional.znach) {
            material.areaCrossSectional = JSON.stringify({"edizm": dto.areaCrossSectional.edizm, "znach": dto.areaCrossSectional.znach})
        } else 
            material.areaCrossSectional = null
            
        await material.save()

        return material
    }

    async createPodMaterial(dto: CreatePodMaterialDto) {
        const pod_material = await this.podMaterialReprository.create({name: dto.name})
        if(!pod_material)
            throw new HttpException('Произошла проблема при создании материала', HttpStatus.BAD_REQUEST)
        
        let density = dto.density
        if(dto.instansMaterial) {
            pod_material.instansMaterial = dto.instansMaterial
        }
        if(density && density.edizm) {
            await this.edizmReprository.findByPk(density.edizm).then(res=>{
                if(res)
                    pod_material.density = JSON.stringify({edizm: res, znach: density.znach})
            })
        }
        await pod_material.save()
    
        return pod_material
    }

    async removePodMaterial(id: number) {
        const result =  this.podMaterialReprository.destroy({where: {id}})
        return result
    }

    async updatePodTypeMaterial(dto: CreatePodMaterialDto) {
        const pod_material = await this.podMaterialReprository.findByPk(dto.id)

        if(!pod_material)
            throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND)

        let density = dto.density

        if(density && density.edizm) 
            await this.edizmReprository.findByPk(density.edizm).then(res =>{
                if(res)
                    pod_material.density = JSON.stringify({edizm: res, znach: density.znach})
            })
        else 
            pod_material.density = null

        pod_material.name = dto.name
        await pod_material.save()

        return pod_material
    }

    async createAndUpdatePodPodMaterial(dto: CreatePodPodMaterial, files: any) {
        let podPodMaterial: any

        if(Number(dto.id)) {
            podPodMaterial = await this.podPodMaterialReprository.findByPk(dto.id)
            podPodMaterial.name = dto.name
        } else {
            podPodMaterial = await this.podPodMaterialReprository.create({ name: dto.name})
        }
       
        const podMaterials = await this.podMaterialReprository.findByPk(dto.podTypeId)

        if(!podPodMaterial || !podMaterials) 
            throw new HttpException('Не удалось создать запись ', HttpStatus.BAD_REQUEST)   

        if(dto.description) {
            podPodMaterial.description = dto.description
        }
        
        let [deliveryTime, kolvo, density]: any[] = []

        deliveryTime = JSON.parse(dto.deliveryTime)
        kolvo = JSON.parse(dto.kolvo).kolvo
        density = JSON.parse(dto.density)

        podPodMaterial.kolvo = []

        if(kolvo) {
            podPodMaterial.kolvo = JSON.stringify(kolvo)
            await podPodMaterial.save()
        }
            
        if(deliveryTime && deliveryTime.edizm && deliveryTime.znach) 
            await this.edizmReprository.findByPk(deliveryTime.edizm).then(res => {
                if(res) 
                    podPodMaterial.deliveryTime = JSON.stringify({edizm: res, znach: deliveryTime.znach})
            })
        else 
            podPodMaterial.deliveryTime = null

        if(density && density.edizm && density.znach) 
            await this.edizmReprository.findByPk(density.edizm).then(res => {
                if(res) 
                    podPodMaterial.density = JSON.stringify({edizm: res, znach: density.znach})
            })
        else 
            podPodMaterial.density = null
        
        let [length, width, height, wallThickness, outsideDiametr, thickness, areaCrossSectional]: any[] = []
        length = JSON.parse(dto.length)
        width = JSON.parse(dto.width)
        height = JSON.parse(dto.height)
        wallThickness = JSON.parse(dto.wallThickness)
        outsideDiametr = JSON.parse(dto.outsideDiametr)
        thickness = JSON.parse(dto.thickness)
        areaCrossSectional = JSON.parse(dto.areaCrossSectional)
        

        if(length && length.edizm && length.znach) 
            await this.edizmReprository.findByPk(length.edizm).then(res => {
                if(res) 
                    podPodMaterial.length = JSON.stringify({edizm: res, znach: length.znach})
            })
        else 
            podPodMaterial.length = null

        if(width && width.edizm && width.znach) 
            await this.edizmReprository.findByPk(width.edizm).then(res => {
                if(res) 
                    podPodMaterial.width = JSON.stringify({edizm: res, znach: width.znach})
            })
        else 
            podPodMaterial.width = null

        if(height && height.edizm && height.znach) 
            await this.edizmReprository.findByPk(height.edizm).then(res => {
                if(res) 
                    podPodMaterial.height = JSON.stringify({edizm: res, znach: height.znach})
            })
        else 
            podPodMaterial.height = null

        if(wallThickness && wallThickness.edizm && wallThickness.znach) 
            await this.edizmReprository.findByPk(wallThickness.edizm).then(res => {
                if(res) 
                    podPodMaterial.wallThickness = JSON.stringify({edizm: res, znach: wallThickness.znach})
            })
        else 
            podPodMaterial.wallThickness = null

        if(outsideDiametr && outsideDiametr.edizm && outsideDiametr.znach) 
            await this.edizmReprository.findByPk(outsideDiametr.edizm).then(res => {
                if(res) 
                    podPodMaterial.outsideDiametr = JSON.stringify({edizm: res, znach: outsideDiametr.znach})
            })
        else 
            podPodMaterial.outsideDiametr = null

        if(thickness && thickness.edizm && thickness.znach) 
            await this.edizmReprository.findByPk(thickness.edizm).then(res => {
                if(res) 
                    podPodMaterial.thickness = JSON.stringify({edizm: res, znach: thickness.znach})
            })
        else 
            podPodMaterial.thickness = null

        if(areaCrossSectional && areaCrossSectional.edizm && areaCrossSectional.znach) 
            await this.edizmReprository.findByPk(areaCrossSectional.edizm).then(res => {
                if(res) 
                    podPodMaterial.areaCrossSectional = JSON.stringify({edizm: res, znach: areaCrossSectional.znach})
            })
        else 
            podPodMaterial.areaCrossSectional = null

        

        if(!Number(dto.id)) {
            await podMaterials.$add('podPodMaterials', podPodMaterial.id)
            await podMaterials.save() 
            if(dto.rootParentId) {
                let material = await this.materialReprository.findByPk(dto.rootParentId)
                if(material)
                    podPodMaterial.materialsId = material.id
            }
        }
        await podPodMaterial.save()

        if(dto.providers) {
            podPodMaterial.providers = []
            let providers = JSON.parse(dto.providers)
            for(let prx of providers) {
                let res = await this.providersReprository.findByPk(prx.id)
                if(res) 
                    podPodMaterial.$add('providers', res.id)
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
                    await podPodMaterial.$add('documents', docId.id)
                }
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

    async getOnePPT(id: number) {
        const PPM = await this.podPodMaterialReprository.findByPk(id, {include: {all: true}})
        if(PPM)
            return PPM
    }
}
