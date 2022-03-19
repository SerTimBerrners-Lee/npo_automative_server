import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { EquipmentService } from 'src/equipment/equipment.service';
import { DateMethods } from 'src/files/date.methods';
import { InstrumentService } from 'src/instrument/instrument.service';
import { InventaryService } from 'src/inventary/inventary.service';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { SettingsService } from 'src/settings/settings.service';
import { Deliveries } from './deliveries.model';
import { CreateDeliveriesDto } from './dto/create-deliveries.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { CreateWaybillDto } from './dto/create-waybill.dto';
import { Providers } from './provider.model';
import { Waybill } from './waybill.model';

@Injectable()
export class ProviderService {
    constructor(@InjectModel(Providers) private providersReprository: typeof Providers,
            @InjectModel(Documents) private documentsReprository: typeof Documents,
            @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
            @InjectModel(Deliveries) private deliveriesReprository: typeof Deliveries,
            @InjectModel(Waybill) private waybillReprository: typeof Waybill,
            private settingsService: SettingsService,
            private documentService: DocumentsService,
            private equipmentService: EquipmentService,
            private instrumentService: InstrumentService,
            @Inject(forwardRef(() => InventaryService))
            private inventaryService: InventaryService
    ) {}

    async createProvider(dto: CreateProviderDto, files: any) {
        let providers: any
        if(Number(dto.id)) 
            providers = await this.providersReprository.findByPk(Number(dto.id), {include: {all: true}})
        else {
            const new_provider = await this.providersReprository.create({ name: dto.name})
            providers = await this.providersReprository.findByPk(new_provider.id, {include: {all: true}})
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
        providers.attention = dto.attention
        
        if(dto.docs, files.document) 
            await this.documentService.attachDocumentForObject(providers, dto, files);

        if(providers.equipments && providers.equipments.length) {
            for(let eq of providers.equipments) {
                providers.$remove('equipments', eq.id)
            }
        }

        if(dto.equipmentListId) {
            try {
                const id_list = JSON.parse(dto.equipmentListId)
                if(id_list.length)
                    for(let eq of id_list) {
                        const equipment = await this.equipmentService.getOneEquipment(eq)
                        if(equipment) providers.$add('equipments', equipment.id)
                    }
            } catch (e) {console.error(e)}
        }

        if(providers.nameInstans && providers.nameInstans.length) {
            for(let instr of providers.nameInstans) {
                providers.$remove('nameInstans', instr.id)
            }
        }

        if(dto.toolListId) {
            try {
                const id_list = JSON.parse(dto.toolListId)
                if(id_list.length)
                    for(let instr of id_list) {
                        const instrument = await this.instrumentService.getNameInstrument(instr)
                        if(instrument) providers.$add('nameInstans', instrument.id)
                    }
            } catch (e) {console.error(e)}
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
        console.log(dto, files);
        const end_deliveries = await this.deliveriesReprository.findOne(
			{
				order: [
					['id', 'DESC']
				], limit: 1
			});
		const numberEndDeliveries = end_deliveries && end_deliveries.id ?  
            end_deliveries.id + 1 : 1;
        const dm = new DateMethods().date();

        if(!dto.number_check || !dto.provider_id || !dto.position_lists) 
            throw new HttpException('Пустое тело запроса', HttpStatus.BAD_REQUEST);

        let deliveries = await this.deliveriesReprository.create({name: numberEndDeliveries, date_create: dm});
        deliveries = await this.deliveriesReprository.findByPk(deliveries.id, {include: {all:true}});

        return await this.upCreateDeliveries(dto, files, deliveries);
    }

    async updateDeliveries(dto: CreateDeliveriesDto, files: any) {
        const deliveries = await this.deliveriesReprository.findByPk(dto.id, {include: {all: true}});
        if(!deliveries)
            throw new HttpException('Записб не найдена', HttpStatus.BAD_REQUEST);

        return await this.upCreateDeliveries(dto, files, deliveries);
    }

    /**
     * Обновление заказа
     * @param dto 
     * @param files 
     * @param deliveries 
     * @returns 
     */
    private async upCreateDeliveries(dto: CreateDeliveriesDto, files: any, deliveries: Deliveries) {
        deliveries.number_check = dto.number_check;
        deliveries.count = dto.count;
        deliveries.nds = dto.nds;
        deliveries.product = dto.position_lists;
        deliveries.date_shipments = dto.date_shipments;
        
        if(dto.description !== 'null') deliveries.description = dto.description;
        else deliveries.description = '';

        const provider = await this.providersReprository.findByPk(dto.provider_id);
        if(provider) {
            deliveries.provider_id = provider.id;
            await deliveries.save();
        }

        if(deliveries.materials && deliveries.materials.length) {
            for(let mat of deliveries.materials) {
                deliveries.$remove('materials', mat.id);
            }
        }
 
        if(dto.position_lists) {
            const positions = JSON.parse(dto.position_lists);
            if(positions.length) {
                for(let pos of positions) {
                    switch (positions.type) {
                        case 'mat':
                            const mat = await this.podPodMaterialReprository.findByPk(pos.id);
                            if(mat) await deliveries.$add('materials', mat.id);
                        case 'tools':
                            const tools = await this.podPodMaterialReprository.findByPk(pos.id);
                            if(tools) await deliveries.$add('tools', tools.id);
                        case 'eq':
                            const eq = await this.podPodMaterialReprository.findByPk(pos.id);
                            if(eq) await deliveries.$add('equipments', eq.id);
                        case 'inventary':
                            const inventary = await this.podPodMaterialReprository.findByPk(pos.id);
                            if(inventary) await deliveries.$add('inventary', inventary.id);
                        default:
                            const matt = await this.podPodMaterialReprository.findByPk(pos.id);
                            if(matt) await deliveries.$add('materials', matt.id);
                    }
                }
            }
        } 

        if(dto.docs, files.document) 
            await this.documentService.attachDocumentForObject(deliveries, dto, files);

        await deliveries.save();
        return deliveries;
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
            if(comparison(dev.date_shipments, undefined, '<=')) 
                new_dev_arr.push(dev)
        }

        return new_dev_arr
    }

    // Проверка заказа удаление из заказа
    private async checkDeliveroedComing(product: any, coming: Array<Deliveries>) {
        for(let com of coming) {
            try {
                let pars = JSON.parse(com.product)
                for(let inx = 0; inx < pars.length; inx++) {
                    if(pars[inx].art == product.art && pars[inx].id == product.id) {
                        pars = pars.slice(inx, 0)
                    }
                }
                com.product = JSON.stringify(pars)
                await com.save()
            } catch(e) {
                console.error(e)
            }
        }
    }

    /**
     * Потход от поставщика / склада
     * @param dto 
     * @param files 
     * @returns 
     */
    async createWaybill(dto: CreateWaybillDto, files: any) {
        const dm = new DateMethods();
		const endShipments = await this.waybillReprository.findOne(
			{
				order: [
					['id', 'DESC']
				],
				limit: 1
			});
		const numberEndShipments = endShipments && endShipments.id ?  
			`№ ${endShipments.id + 1} от ${dm.date()}` : `№ 1 от ${dm.date()}`;

        if(!dto.product_list) 
            throw new HttpException('Пустое тело запроса', HttpStatus.BAD_REQUEST) ;

        const waybill = await this.waybillReprository.create({name: numberEndShipments});

        if(dto.product_list) {
            const comings = await this.getAllDeliveriedComing();
            try {
                const pars = JSON.parse(dto.product_list);
                waybill.product = dto.product_list;
                for(let product of pars) {
                    this.checkDeliveroedComing(product, comings)
                    let object: any
                    if(product.type == 'mat')
                        object = await this.settingsService.getOnePPT(product.id)
                    if(product.type == 'tools')
                        object = await this.instrumentService.getNameInstrument(product.id)
                    if(product.type == 'eq')
                        object = await this.equipmentService.getOneEquipment(product.id)
                    if(product.type == 'inventary')
                        object = await this.inventaryService.getInventaryById(product.id)
                    if(object) {
                        object.shipments_kolvo - product.kol <= 0 ? object.shipments_kolvo = 0 :
                            object.shipments_kolvo  = object.shipments_kolvo - product.kol
                        if(product.type == 'mat')
                            object.material_kolvo = object.material_kolvo + product.kol
                        if(product.type == 'tools')
                            object.material_kolvo = object.instrument_kolvo + product.kol
                        if(product.type == 'eq')
                            object.material_kolvo = object.equipment_kolvo + product.kol
                        if(product.type == 'inventary')
                            object.material_kolvo = object.inventary_kolvo + product.kol
                        object.price = product.sum ? product.sum : 0

                        if(product.type == 'mat') {
                            try {
                                const pars_ez: any = JSON.parse(object.ez_kolvo)
                                if(pars_ez) {
                                    const edit_ez:any = Object.values(pars_ez)[Number(product.ez) ? Number(product.ez) - 1 : 0]

                                    edit_ez.material_kolvo = edit_ez.material_kolvo  +  product.kol
                                    edit_ez.shipments_kolvo - product.kol <= 0 ? object.shipments_kolvo = 0 :
                                    object.shipments_kolvo  = object.shipments_kolvo - product.kol

                                    Object.values(pars_ez)[Number(product.ez) ? Number(product.ez) - 1 : 0] = edit_ez
                                    console.log('edit_ez', edit_ez)
                                    object.ez_kolvo = JSON.stringify(pars_ez)
                                }
                            } catch(e) {console.error(e)}
                        }
                        await object.save()
                    }
                }
            } catch (e) { console.error(e) }
            await waybill.save();
            return waybill;
        }

        if(dto.provider_id) {
            const provider = await this.providersReprository.findByPk(dto.provider_id)
            if(provider) {
                waybill.provider_id = provider.id
                await waybill.save()
            }
        }

        if(dto.description != 'null')
            waybill.description = dto.description
            else 
                waybill.description = ''

        if(dto.docs, files.document) 
            await this.documentService.attachDocumentForObject(waybill, dto, files);


        await waybill.save()
        return waybill
    }

    async getAllWaybill() {
        return await this.waybillReprository.findAll({include: {all: true}})
    }

    async attachFileToProvider(provider_id: number, file_id: number) {
        const provider = await this.providersReprository.findByPk(provider_id);
        const file = await this.documentService.getFileById(file_id);

        if(provider && file) 
            provider.$add('documents', file.id);

        return file
    }
}
