import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { DateMethods } from 'src/files/date.methods';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { SettingsService } from 'src/settings/settings.service';
import { Deliveries } from './deliveries.model';
import { CreateDeliveriesDto } from './dto/create-deliveries.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { Providers } from './provider.model';

@Injectable()
export class ProviderService {
    constructor(@InjectModel(Providers) private providersReprository: typeof Providers,
            @InjectModel(Documents) private documentsReprository: typeof Documents,
            @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
            @InjectModel(Deliveries) private deliveriesReprository: typeof Deliveries,
            private settingsService: SettingsService,
            private documentService: DocumentsService
    ) {}

    async createProvider(dto: CreateProviderDto, files: any) {
        let providers: any
        if(Number(dto.id)) {
            providers = await this.providersReprository.findByPk(Number(dto.id))
        } else {
            providers = await this.providersReprository.create({ name: dto.name})
        }
        if(!providers)
            throw new HttpException('Произошла ошибка при добавлении пользователя', HttpStatus.NOT_FOUND)
            
        providers.name = dto.name
        
        if(dto.rekvisit != 'null') 
            providers.rekvisit = dto.rekvisit
        else
            providers.rekvisit =''
        if(dto.contacts != 'null') 
            providers.contacts = dto.contacts
        else
            providers.contacts =''
        if(dto.inn != 'null') 
            providers.inn = dto.inn
        else
            providers.inn =''
        if(dto.cpp != 'null') 
            providers.cpp = dto.cpp 
        else
            providers.cpp =''
        if(dto.description != 'null') 
            providers.description = dto.description 
        else
            providers.description =''
        await providers.save()
        
        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentService.saveDocument(
                    document, 
                    'p', 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await providers.$add('documents', docId.id)
                }
                i++
            }
        }
        
        if(dto.materialList) {
            let mat = JSON.parse(dto.materialList)
            if(mat.length) {
                for(let m of mat) {
                    let check = await this.podPodMaterialReprository.findByPk(m)
                    if(check) 
                        await providers.$add('materials', check.id)
                }
            }
        }

        await providers.save()

        return providers
    
    }

    async createDeliveries(dto: CreateDeliveriesDto, files: any) {
        const end_deliveries = await this.deliveriesReprository.findOne(
			{
				order: [
					['id', 'DESC']
				], limit: 1
			})
		const numberEndDeliveries = end_deliveries && end_deliveries.id ?  
            end_deliveries.id + 1 : 1
        const dm = new DateMethods().date()

        let deliveries = await this.deliveriesReprository.create({name: numberEndDeliveries, date_create: dm})
        deliveries = await this.deliveriesReprository.findByPk(deliveries.id, {include: {all:true}})


        return await this.upCreateDeliveries(dto, files, deliveries)
        
    }

    async updateDeliveries(dto: CreateDeliveriesDto, files: any) {
        const deliveries = await this.deliveriesReprository.findByPk(dto.id, {include: {all: true}})
        if(!deliveries)
            throw new HttpException('Записб не найдена', HttpStatus.BAD_REQUEST)

        return await this.upCreateDeliveries(dto, files, deliveries)
    }

    private async upCreateDeliveries(dto: CreateDeliveriesDto, files: any, deliveries: Deliveries) {
        deliveries.number_check = dto.number_check
        deliveries.count = dto.count
        deliveries.nds = dto.nds
        deliveries.product = dto.material_list
        deliveries.date_shipments = dto.date_shipments
        
        if(dto.description !== 'null') deliveries.description = dto.description
        else deliveries.description = ''

        const provider = await this.providersReprository.findByPk(dto.provider_id)
        if(provider) {
            deliveries.provider_id = provider.id
            await deliveries.save()
        }

        if(deliveries.materials && deliveries.materials.length) {
            for(let mat of deliveries.materials) {
                deliveries.$remove('materials', mat.id)
            }
        }

        if(dto.material_list) {
            let mat = JSON.parse(dto.material_list)
            if(mat.length) {
                for(let m of mat) {
                    let check = await this.podPodMaterialReprository.findByPk(m.id)
                    if(check) 
                        await deliveries.$add('materials', check.id)
                }
            }
        } 

        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentService.saveDocument(
                    document, 
                    'p', 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await deliveries.$add('documents', docId.id)
                }
                i++
            }
        }

        await deliveries.save()

        return deliveries
    }

    async getProviders() {
        const providers = await this.providersReprository.findAll({include: {all: true}})
        if(providers)
            return providers
    }

    async banProvider(id: number) {
        const provider = await this.providersReprository.findByPk(id)
        if(provider) {
            provider.ban = !provider.ban
            await provider.save()
            return provider
        }
    }

    async getAllDeliveried() {
        return await this.deliveriesReprository.findAll({include: {all: true}})
    }
    
    async getProviderById(id: number) {
        return await this.providersReprository.findByPk(id, {include: {all: true}})
    }

    async getAllDeliveriedComing() {
        const deliveries = await this.deliveriesReprository.findAll({include: {all: true}})
        
        if(!deliveries)
            throw new HttpException('Поставок не найдено', HttpStatus.BAD_REQUEST)

        let new_dev_arr = []
        const comparison = new DateMethods().comparison

        for(let dev of deliveries) {
            if(comparison(dev.date_shipments, undefined, '<')) 
                new_dev_arr.push(dev)
        }

        return new_dev_arr
    }
}
