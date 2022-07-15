import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Equipment } from 'src/equipment/equipment.model';
import { EquipmentService } from 'src/equipment/equipment.service';
import { DateMethods } from 'src/files/date.methods';
import { StatusMetaloworking } from 'src/files/enums';
import { InstrumentService } from 'src/instrument/instrument.service';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { Inventary } from 'src/inventary/inventary.model';
import { InventaryService } from 'src/inventary/inventary.service';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
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
            @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
            @InjectModel(NameInstrument) private instrumentReprository: typeof NameInstrument,
            @InjectModel(Equipment) private equipmentReprository: typeof Equipment,
            @InjectModel(Inventary) private inventaryReprository: typeof Inventary,
            @InjectModel(Deliveries) private deliveriesReprository: typeof Deliveries,
            @InjectModel(Waybill) private waybillReprository: typeof Waybill,
            @InjectModel(Detal) private detalReprository: typeof Waybill,
            @InjectModel(Cbed) private cbedReprository: typeof Waybill,
            @InjectModel(Metaloworking) private metalReprository: typeof Metaloworking,
            private settingsService: SettingsService,
            private documentService: DocumentsService,
            private equipmentService: EquipmentService,
            private instrumentService: InstrumentService,
            @Inject(forwardRef(() => InventaryService))
            private inventaryService: InventaryService,
            private sequelize: Sequelize
    ) {}

    async createProvider(dto: CreateProviderDto, files: any) {
        let providers: any
        if (Number(dto.id)) 
            providers = await this.providersReprository.findByPk(Number(dto.id), {include: {all: true}})
        else {
            const new_provider = await this.providersReprository.create({ name: dto.name})
            providers = await this.providersReprository.findByPk(new_provider.id, {include: {all: true}})
        }
        if (!providers)
            throw new HttpException('Произошла ошибка при добавлении пользователя', HttpStatus.NOT_FOUND)
            
        providers.name = dto.name
        
        if (dto.rekvisit != 'null') 
            providers.rekvisit = dto.rekvisit;
        else
            providers.rekvisit = ''
        if (dto.contacts != 'null') 
            providers.contacts = dto.contacts;
        else
            providers.contacts = '';
        if (dto.inn != 'null') 
            providers.inn = dto.inn;
        else
            providers.inn =''
        if (dto.cpp != 'null') 
            providers.cpp = dto.cpp;
        else
            providers.cpp = '';
        if (dto.description != 'null') 
            providers.description = dto.description 
        else
            providers.description = '';
        await providers.save();
        providers.attention = dto.attention;
        
        if (dto.docs, files.document) 
            await this.documentService.attachDocumentForObject(providers, dto, files);

        if (providers.equipments && providers.equipments.length) {
            for (const eq of providers.equipments) {
                providers.$remove('equipments', eq.id);
            }
        }

        if (dto.equipmentListId) {
            try {
                const id_list = JSON.parse(dto.equipmentListId);
                if (id_list.length)
                    for (const eq of id_list) {
                        const equipment = await this.equipmentService.getOneEquipment(eq);
                        if (equipment) providers.$add('equipments', equipment.id);
                    }
            } catch (e) {console.error(e)}
        }

        if (providers.nameInstans && providers.nameInstans.length) {
            for (let instr of providers.nameInstans) {
                providers.$remove('nameInstans', instr.id);
            }
        }

        if (dto.toolListId) {
            try {
                const id_list = JSON.parse(dto.toolListId)
                if(id_list.length)
                    for(let instr of id_list) {
                        const instrument = await this.instrumentService.getNameInstrument(instr)
                        if(instrument) providers.$add('nameInstans', instrument.id)
                    }
            } catch (e) {console.error(e)}
        }
        
        if (dto.materialList) { 
            const mat = JSON.parse(dto.materialList);
            if (mat.length) {
                for (const m of mat) {
                    let check = await this.podPodMaterialReprository.findByPk(m);
                    if (check) await providers.$add('materials', check.id);
                }
            }
        }

        await providers.save();
        return providers;
    
    }

    async createDeliveries(dto: CreateDeliveriesDto, files: any) {
        const end_deliveries = await this.deliveriesReprository.findOne(
			{
				order: [
					['id', 'DESC']
				], limit: 1
			});
		const numberEndDeliveries = end_deliveries && end_deliveries.id ?  
            end_deliveries.id + 1 : 1;
        const dm = new DateMethods().date();

        if (!dto.number_check || !dto.provider_id || !dto.position_lists) 
            throw new HttpException('Пустое тело запроса', HttpStatus.BAD_REQUEST);

        let deliveries = await this.deliveriesReprository.create({name: numberEndDeliveries, date_create: dm});
        deliveries = await this.deliveriesReprository.findByPk(deliveries.id, {include: {all:true}});

        return await this.upCreateDeliveries(dto, files, deliveries);
    }

    async updateDeliveries(dto: CreateDeliveriesDto, files: any) {
        const deliveries = await this.deliveriesReprository.findByPk(dto.id, {include: {all: true}});
        if(!deliveries)
            throw new HttpException('Записб не найдена', HttpStatus.BAD_REQUEST);

        return await this.upCreateDeliveries(dto, files, deliveries, true);
    }

    /**
     * Обновление заказа
     * @param dto 
     * @param files 
     * @param deliveries 
     * @returns 
     */
    private async upCreateDeliveries(
            dto: CreateDeliveriesDto, 
            files: any, 
            deliveries: Deliveries,
            is_update: boolean = false) {

        deliveries.number_check = dto.number_check;
        deliveries.count = dto.count;
        deliveries.nds = dto.nds;
        deliveries.product = dto.position_lists;
        deliveries.date_shipments = dto.date_shipments;
        
        if(dto.description !== 'null') deliveries.description = dto.description;
        else deliveries.description = '';

        const provider = await this.providersReprository.findByPk(dto.provider_id);
        if (provider) {
            deliveries.provider_id = provider.id;
            await deliveries.save();
        }

        if (deliveries.materials && deliveries.materials.length) {
            for(let mat of deliveries.materials) {
                deliveries.$remove('materials', mat.id);
            }
        }
 
        if (dto.position_lists) {
            const positions = JSON.parse(dto.position_lists);
            if (positions.length) {
                const include = [{
                    model: Deliveries
                }];

                for (let pos of positions) {
                    let object: PodPodMaterial | Inventary | Equipment | NameInstrument;
                    const pos_obj = { id: pos, type: pos.type };

                    switch (positions.type) {
                        case 'mat':
                            object = await this.podPodMaterialReprository.findByPk(pos.id, { include: include });
                            if (object) {
                                if (is_update && dto.id)
                                    pos = countUp(object.deliveries, pos_obj, dto.id, pos);
                                
                                const ez_position = this.parseMaterialEz(pos.ez);
                                await this.editPositionEz(object, ez_position, pos.kol, 5);
                                await deliveries.$add('materials', object.id);
                                object.material_kolvo += pos;
                                await object.save();
                            }
                        case 'tools':
                            object = await this.instrumentReprository.findByPk(pos.id, { include: include });
                            if (object) {
                                if(is_update && dto.id) pos = countUp(object.deliveries, pos_obj, dto.id, pos);
                                await deliveries.$add('tools', object.id);
                                object.instrument_kolvo += pos;
                                await object.save();
                            }
                        case 'eq':
                            object = await this.equipmentReprository.findByPk(pos.id, { include: include });
                            if (object) {
                                if (is_update && dto.id) pos = countUp(object.deliveries, pos_obj, dto.id, pos);
                                await deliveries.$add('equipments', object.id);
                                object.equipment_kolvo += pos;
                                await object.save();
                            }
                        case 'inventary':
                            object = await this.inventaryReprository.findByPk(pos.id, { include: include });
                            if (object) {
                                if (is_update && dto.id) pos = countUp(object.deliveries, pos_obj, dto.id, pos);
                                await deliveries.$add('inventary', object.id);
                                object.inventary_kolvo += pos;
                                await object.save();
                            }
                    }
                }
            }
        } 

        function countUp(delivs: any, pos_obj: any, id: number, pos: any) {
            const last = this.returnPosInProductList(delivs, pos_obj, dto.id);
            if(last && last < Number(pos.kol)) pos.kol = Number(pos.kol) - last;
            if(last && last > Number(pos.kol)) pos.kol = last - Number(pos.kol);

            return pos;
        }

        if(dto.docs, files.document) 
            await this.documentService.attachDocumentForObject(deliveries, dto, files);

        await deliveries.save();
        return deliveries;
    }

    private returnPosInProductList(deliv: Array<Deliveries>, prod: {id: number, type: string}, dev_id: number): number {
        try {
            for(const dev of deliv) {
                const pars = JSON.parse(dev.product);
                for(const item of pars) {
                    if(dev_id == dev.id && prod.id == item.id && prod.type == item.type)
                        return Number(item.kol);
                }
            }
            if(!deliv.length) return 0;
        }catch(err) {
            console.error(err)
        }
    }

    async getProviders() {
        const providers = await this.providersReprository.findAll({include: {all: true}, where: {ban: false}});
        if (!providers) throw new HttpException('Не удалось получить поставщиков', HttpStatus.BAD_REQUEST);

        return providers;
    }

    async getProvidersArchive() {
        const provider = await this.providersReprository.findAll({ attributes: ['id', 'name', 'inn'], where: {ban: true} });
        if (!provider) throw new HttpException('Не удалось получить поставщиков в архиве', HttpStatus.BAD_REQUEST);

        return provider;
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
        
        if (!deliveries)
            throw new HttpException('Поставок не найдено', HttpStatus.BAD_REQUEST)

        let new_dev_arr = [];
        const comparison = new DateMethods().comparison;

        for (const dev of deliveries) {
            if (comparison(dev.date_shipments, undefined, '<=')) new_dev_arr.push(dev);
        }
        return new_dev_arr;
    }

    // Проверка заказа удаление из заказа
    private async checkDeliveroedComing(product: any, coming: Array<Deliveries>) {
        for (const com of coming) {
            try {
                let pars = JSON.parse(com.product)
                for (let inx = 0; inx < pars.length; inx++) {
                    if(pars[inx].art == product.art && pars[inx].id == product.id)
                        pars = pars.slice(inx, 0);
                }
                com.product = JSON.stringify(pars);
                await com.save();
            } catch(e) {
                console.error(e);
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
        const t = await this.sequelize.transaction();
        const transactionHost = { transaction: t };

        try {
            console.log(dto);
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

            if (!dto.product_list) 
                throw new HttpException('Пустое тело запроса', HttpStatus.BAD_REQUEST);

            const waybill = await this.waybillReprository.create({name: numberEndShipments, type_сoming: dto.typeComing}, transactionHost);

            if (dto.product_list) {
                const comings = await this.getAllDeliveriedComing();
                try {
                    const pars = JSON.parse(dto.product_list);
                    waybill.product = dto.product_list;
                    for (const product of pars) {
                        if (dto.typeComing == 'Поставщик') this.checkDeliveroedComing(product, comings);
                        let object: any
                        if (product.type == 'mat')
                            object = await this.settingsService.getOnePPT(product.id);
                        if (product.type == 'tools') 
                            object = await this.instrumentService.getNameInstrument(product.id);
                        if (product.type == 'eq')
                            object = await this.equipmentService.getOneEquipment(product.id);
                        if (product.type == 'inventary')
                            object = await this.inventaryService.getInventaryById(product.id);

                        if (dto.typeComing == 'Металлообработка') {
                            object = await this.detalReprository.findByPk(product.id);
                            object.detal_kolvo += Number(product.kol);
                            if (product.worker_id)
                                object.$remove('metaloworking', product.worker_id);
                            this.changeStatusMetall(product.worker_id, product.kol);
                        } else if (dto.typeComing == 'Сборка'){
                            object = await this.cbedReprository.findByPk(product.id);
                            object.cbed_kolvo += Number(product.kol);
                        }
                        if (object) {
                            if (dto.typeComing == 'Поставщик') object.shipments_kolvo - product.kol <= 0 ? object.shipments_kolvo = 0 :
                                object.shipments_kolvo  = object.shipments_kolvo - product.kol;
                            if (product.type == 'tools')
                                object.material_kolvo = object.instrument_kolvo + product.kol;
                            if (product.type == 'eq')
                                object.material_kolvo = object.equipment_kolvo + product.kol;
                            if (product.type == 'inventary')
                                object.material_kolvo = object.inventary_kolvo + product.kol;
                            object.price = product.sum ? product.sum : 0

                            if (product.type == 'mat') {
                                object.material_kolvo = object.material_kolvo + product.kol;
                                const ez_pos = this.parseMaterialEz(product.ez);
                                await this.editPositionEz(object, ez_pos, product.kol, 1);
                                await this.editPositionEz(object, ez_pos, product.kol, 4);
                            }
                            await object.save();
                        }
                    }
                } catch (e) { console.error(e) }
            }

            if (dto.provider_id && dto.provider_id !== 'null') {
                const provider = await this.providersReprository.findByPk(dto.provider_id);
                if (provider)   waybill.provider_id = provider.id;
            }

            if (dto.description != 'null')
                waybill.description = dto.description;
            else waybill.description = '';

            if (dto.docs, files.document) 
                await this.documentService.attachDocumentForObject(waybill, dto, files);

            await waybill.save(transactionHost);
            await t.commit();
            return waybill;

        } catch(err) {
            console.error(err);
            await t.rollback();
            throw new HttpException('Ошибка с сохранением прихода на склад', HttpStatus.BAD_GATEWAY)
        }
    }


    private async changeStatusMetall(met_id: number, kol: number) {
        if (!met_id) return false;
        const metalloworking = await this.metalReprository.findByPk(met_id);
        if (!metalloworking) return false;
        metalloworking.status = StatusMetaloworking.сonducted;
        metalloworking.kolvo_create = kol || 1;
        await metalloworking.save();
    }

    // Возвращаем в строке позицию матерала
    private parseMaterialEz(ez: number): string {
        switch (Number(ez)) {
            case 1:
                return 'c1_kolvo';
            case 2:
                return 'c2_kolvo';
            case 3:
                return 'c3_kolvo';
            case 4:
                return 'c4_kolvo';
            case 5:
                return 'c5_kolvo';
            default:
                return 'c1_kolvo';
        }
    }
    // меняем ez у элемента 
    /**
     * 
     * @param material 
     * @param str_pos 
     * @param kol 
     * @param to_field 1..5
     */
    private async editPositionEz(material: PodPodMaterial, str_pos: string, kol: number, to_field: number): Promise<void> {
        try {
            const pars = JSON.parse(material.ez_kolvo);

            if (to_field == 1)
                pars[str_pos].material_kolvo += Number(kol);
            else if (to_field == 2)
                pars[str_pos].shipments_kolvo += Number(kol);
            else if (to_field == 3)
                pars[str_pos].min_remaining += Number(kol);
            else if (to_field == 4)
                pars[str_pos].price = Number(kol);
            else if (to_field == 5)
                pars[str_pos].deliveries_kolvo += Number(kol);

            material.ez_kolvo = JSON.stringify(pars);
            await material.save();
        } catch(e) { console.error(e) }
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
