import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Assemble } from 'src/assemble/assemble.model';
import { AssembleService } from 'src/assemble/assemble.service';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { TypeOperation } from 'src/detal/type-operation.model';
import { EZ_KOLVO, KOLVO, StatusAssemble, StatusMetaloworking, statusShipment } from 'src/files/enums';
import { logs } from 'src/files/logs';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { Product } from 'src/product/product.model';
import { Providers } from 'src/provider/provider.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { Shipments } from 'src/shipments/shipments.model';
import { Deficit } from './deficit.model';
import { UpdateDeficitDto } from './dto/create-deficite.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { Marks } from './marks.model';

@Injectable()
export class ScladService {
    constructor(
        @InjectModel(Deficit) private deficitReprository: typeof Deficit,
        @InjectModel(Marks) private marksReprository: typeof Marks,
        @InjectModel(Product) private productReprository: typeof Product,
        @InjectModel(Cbed) private cbedReprository: typeof Cbed,
        @InjectModel(Detal) private detalReprository: typeof Detal,
        @InjectModel(Providers) private providerReprository: typeof Providers,
        @InjectModel(PodPodMaterial) private material: typeof PodPodMaterial,
        @InjectModel(Shipments) private shipments: typeof Shipments,
        private assembleService: AssembleService,
        private metaloworkingService: MetaloworkingService,
        ) {
            this.logger = new Logger();
            this.formingDeficitMaterial = false;
        }

    private logger: Logger;
    private formingDeficitMaterial: boolean;

    async updateDeficit(dto: UpdateDeficitDto) {
        const deficit = await this.deficitReprository.update(
            { minRemainder: dto.minRemainder, recommendedRemainder: dto.recommendedRemainder }, 
            { where: {id: dto.id} }
        );
                
        if(!deficit)
            throw new HttpException('Не удалось обновить таблицу дефицита', HttpStatus.BAD_REQUEST);
        return deficit;
    }

    async getDeficit() {
        return await this.deficitReprository.findAll({include: {all: true}});
    }

    async createMark(dto: CreateMarkDto) {
       const mark = await this.marksReprository.create(dto);
        if(!mark) 
            throw new HttpException('Произошла ошибка при добавлении отметки.', HttpStatus.BAD_REQUEST);

        await this.checkStatusProcess(dto);
        return mark;
    }

    async getMarks() {
        return await this.marksReprository.findAll({include: {all: true}});
    }

    async getMarksByOperation(id: number) {
        const operations = await this.marksReprository.findAll({ where: { oper_id: id } });
        if(!operations)
            throw new HttpException('Не удалось получить Марки по операции', HttpStatus.BAD_GATEWAY);

        return operations;
    }

    private async checkStatusProcess(dto: CreateMarkDto) {
        let objects: any;
        let tp: TechProcess;
        if (dto.assemble_id) objects = await this.assembleService.getAssembleById(dto.assemble_id);
        if (dto.metaloworking_id) objects = await this.metaloworkingService.getOneMetaloworkingById(dto.metaloworking_id);
        if (!objects) 
            throw new HttpException('Произошла ошибка при добавлении отметки2.', HttpStatus.BAD_REQUEST);

        if (dto.assemble_id) 
            if(objects.cbed && objects.cbed.techProcesses) tp = objects.cbed.techProcesses;
        if (dto.metaloworking_id) 
            if(objects.detal && objects.detal.techProcesses) tp = objects.detal.techProcesses;
            
        if (!tp || !tp.operations || !tp.operations.length) 
            throw new HttpException('Произошла ошибка при добавлении отметки.', HttpStatus.BAD_REQUEST);
            
        let create_marks = 0;
        for (const oper of tp.operations) {
            let kol = 0;
            for (const mark of oper.marks) {
                kol += mark.kol;
            }
            if (objects.kolvo_shipments <= kol) create_marks++;
        }
        if (create_marks >= tp.operations.length) {
            if (dto.assemble_id) objects.status = StatusAssemble.done;
            if (dto.metaloworking_id) objects.status = StatusMetaloworking.done;
        }
        await objects.save();
    }

    /**
     * 
     * Дефициты
     * Получаем все объекты, потом подсчитываем и сохраняем минимальный остаток
     * Сохраняем все
     * Вытаскиваем дифицит по параметрам сново 
     */

    async getAllDeficitProduct() {
        const products = await this.productReprository.findAll({
            attributes: ['haracteriatic', 'id', 'product_kolvo', 'shipments_kolvo', 'min_remaining'],
            include: [{
                model: Shipments,
                attributes: ['kol', 'id', 'status']
            }]
        });

        for (const item of products) {
            try {
                const har = JSON.parse(item.haracteriatic)[1].znach;
                item.min_remaining = Number(har);
                
                item.shipments_kolvo = 0;
                if (item.shipments.length) {
                    for (const sh of item.shipments) {
                        if (sh.status != statusShipment.done)
                            item.shipments_kolvo += Number(sh.kol);
                    }
                }
                await item.save();
            } catch(err) {console.error(err)}
        }

        return await this.productReprository.findAll({
            include: [
                {
                    model: TechProcess
                },
                'shipments' 
            ],
            where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.col('product_kolvo'), '<', Sequelize.col('min_remaining')
                    ),
                    Sequelize.where(
                        Sequelize.col('min_remaining'), '<', Sequelize.col('shipments_kolvo') 
                    )
                ]
            }
        });
    }

    async getAllDeficitCbed() {
		const cbeds = await this.cbedReprository.findAll({
            attributes: {exclude: ['attention', 'haracteriatic', 'parametrs', 'description']},
            include: {
                model: Shipments,
                attributes: ['id', 'list_cbed_detal', 'list_hidden_cbed_detal', 'status']
            }
        });

        for (let inx in cbeds) {
            const remaining = await this.minRemainder(cbeds[inx], 'cbed');
            const shipments_kolvo = await this.getIzdInShipmentsList(cbeds[inx].shipments, cbeds[inx].id, 'cbed');

            cbeds[inx].min_remaining = remaining;
            cbeds[inx].shipments_kolvo = shipments_kolvo;
            await cbeds[inx].save();
        }

        const deficitCbed = await this.cbedReprository.findAll({include: [
            {
                model: TechProcess
            },
            {
                model: Assemble,
                attributes: ['id', 'date_order', 'date_shipments', 'kolvo_shipments', 'number_order']
            },
            'shipments'
        ], 
            where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.col('cbed_kolvo'), '<', Sequelize.col('min_remaining')
                    ),
                    Sequelize.where(
                        Sequelize.col('min_remaining'), '<', Sequelize.col('shipments_kolvo') 
                    )
                ]
            }
        });

        return deficitCbed;
	}

    async getAllDeficitDetal() {
        const detals = await this.detalReprository.findAll({
            attributes: {exclude: ['attention', 'haracteriatic', 'parametrs', 'description']},
            include: {
                model: Shipments,
                attributes: ['id', 'list_cbed_detal', 'list_hidden_cbed_detal', 'status']
            }
        }) 

        for (let inx in detals) {
            const remaining = await this.minRemainder(detals[inx], 'detal')
            const shipments_kolvo = await this.getIzdInShipmentsList(detals[inx].shipments, detals[inx].id, 'detal');
            
            detals[inx].min_remaining = remaining
            detals[inx].shipments_kolvo = shipments_kolvo;
            await detals[inx].save()
        }

		const deficitDetal = await this.detalReprository.findAll({include: [
            {
                model: TechProcess, 
                include: [{
                    model: Operation,
                    include: [
                        {
                            model: TypeOperation
                        }
                    ], 
                    attributes: ['id']
                }]
            },
            {
                model: Metaloworking,
                attributes: ['id', 'date_order', 'date_shipments', 'kolvo_shipments', 'number_order']
            },
            'shipments'
        ], 
        where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.col('detal_kolvo'), '<', Sequelize.col('min_remaining') 
                    ),
                    Sequelize.where(
                        Sequelize.col('min_remaining'), '<', Sequelize.col('shipments_kolvo') 
                    ),
                ]
            }
        });

        return deficitDetal;
	}

    async getIzdInShipmentsList(shipments: any, izd_id: number, type: string) {
        let shipments_kolvo = 0;

        for (const item of shipments) {
            if (item.status == statusShipment.done) continue;
            
            let arr = [];
            if (item.list_cbed_detal) arr = JSON.parse(item.list_cbed_detal);
            if (item.list_hidden_cbed_detal) arr = arr.concat(JSON.parse(item.list_hidden_cbed_detal));

            for (const izd of arr) {
                if (izd['obj'].id == izd_id && izd['type'] == type)
                    shipments_kolvo += Number(izd['kol']);
            }
        }
        return shipments_kolvo;
    }

    async minRemainder(izd: Cbed | Detal, type: string): Promise<number> {
        let remainder = 0;
        let list_id_arr = [];
        let listType = 'listCbed'
        let keyList = 'cb'
        let query = {}
        if(type == 'detal') {
            listType = 'listDetal'
            keyList = 'det'
            query['include']= [{
                model: Detal,
                where: {
                    id: izd.id
                }
            }]
        }
        if(type == 'cbed') {
            try {
                const cbeds = JSON.parse(izd.cbed)
                for(const cb of cbeds) {
                    list_id_arr.push(cb.id)
                }
                query['where'] = { id: list_id_arr }
            } catch(err) {console.error(err)}   
        }

        query['attributes'] = ['id', listType]
        const getCbeds = await this.cbedReprository.findAll(query)

        remainder += await this.getMinProductRemain(izd.id, remainder, listType, type, keyList)

        for(const cb of getCbeds) {
            try {
                if(!cb[listType]) continue;
                const listIzd = JSON.parse(cb[listType])
                for(const item of listIzd) {
                    const parent_kol = Number(item.kol);
                    if(item[keyList].id == izd.id && parent_kol) {
                        const min_of_parent = await this.getMinProductRemain(cb.id, 0, 'listCbed', 'cbed', 'cb')
                        remainder += (parent_kol * min_of_parent)
                    }
                }
            } catch(err) {this.logger.error("\n\n\nISERROR\n\n\n", err)}
        }
        return remainder;
    }

    /**
     * 
     * @param izd_id - id Cbed | id Detal
     * @param remainder - потребность
     * @param listType - listCbed | listDetal
     * @param type - cbed | detal
     * @param keyList cb | det
     * @returns 
     */
    async getMinProductRemain(izd_id: number, remainder: number, listType: string, type: string, keyList: string): Promise<number> {
        const product = await this.productReprository.findAll({
            include: [
                {
                    model: type == 'cbed' ? Cbed : Detal,
                    attributes: ['id'],
                    where: {
                        id: izd_id
                    }
                }
            ],
            attributes: ['haracteriatic', listType]
        })

        if(!product.length) return remainder

        for(const item of product) {
            try {
                const haracteriatic = Number(JSON.parse(item.haracteriatic)[1].znach);
                const listIzd = JSON.parse(item[listType])
                for(const item of listIzd) {
                    if(item[keyList].id == izd_id && haracteriatic > 0)
                        remainder += (Number(item.kol) * haracteriatic)
                }
            } catch(e) {console.error(e)}
        }

        return remainder
    }

    // return object in list  
    searchIzdToList(izd_id: number, type: string, list: any): object {
        for (const item of list) {
            if (izd_id == item.obj.id && type == item.type) return item;
        }
        return undefined;	
    }

    // Deficit  materials
    async getAllMaterialDeficit() {
        if (!this.formingDeficitMaterial) {
            this.writtingDeficitMaterials();
            this.formingDeficitMaterial = true;
        }
        const materials = await this.material.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.col('material_kolvo'), '<', Sequelize.col('min_remaining') 
                    ),
                    Sequelize.where(
                        Sequelize.col('min_remaining'), '<', Sequelize.col('shipments_kolvo') 
                    ),
                ]
            }
        })

        if (!materials)
            throw new HttpException('Произошла ошибка при получении дефицита. ', HttpStatus.BAD_REQUEST);

        return materials;
    }

    // Сортировка под каждый заказ отдельон на ПЛАН
    /**
     * 
     * @param id_shipments number
     * @param type cbed | detal 
     */
    async materialShipmentsType(id_shipments: number, type: string) {
        const include = type == 'cbed' ? [{ model: Cbed }, { model: Product }] : [{ model: Detal }];

        const res = await this.shipments.findByPk(id_shipments, { include });
        if (!res) throw new HttpException('Не удалось получить заказ', HttpStatus.BAD_REQUEST);
        const shipments = res.toJSON();

        let list_objects = [];
        try {
            if (res.list_cbed_detal) list_objects = JSON.parse(res.list_cbed_detal);
            if (res.list_hidden_cbed_detal) list_objects = list_objects.concat(JSON.parse(res.list_hidden_cbed_detal));
            if (type == 'cbed' && res.product) list_objects.push({ 
                type: 'cbed',
                product: true,
                obj: { id: res.product.id, name: res.product.name, articl: res.product.articl },
                kol: res.kol || 0
            });
            
            list_objects = list_objects.filter(el => el.type == type);
            for (const obj of list_objects) {
                let iterable: any;
                if (type == 'cbed') {
                    iterable = shipments['cbeds'];
                    shipments['product'].product = true;
                    iterable.push(shipments['product']);
                } else iterable = shipments['detals'];

                for (const item of iterable) {
                    if (obj.obj.id != item.id) continue;
                    if (item.product && !obj.product) continue;

                    let pars = [];
                    if (item.materialList) pars = JSON.parse(item.materialList);
                    if (item.listPokDet) pars = pars.concat(JSON.parse(item.listPokDet));

                    if (type == 'detal' && item.mat_zag) {
                        const material = await this.material.findByPk(item.mat_zag);
                        if (material) pars.push({
                            art: '',
                            mat: { id: item.mat_zag, name: material.name },
                            kol: 1,
                            ez:  1,
                        });
                    }
                    obj.materialList = pars;
                }
            }
        } catch (err) { console.error(err) }
        
        const materialsArr = [];
        // Фильтруем материалы
        for (const item of list_objects) {
            for (const mat of item.materialList) {
                let check = true;
                for( const mA of materialsArr) {
                    if (mat.mat.id == mA.mat.id) {
                        const count = (Number(mA.kol) * Number(item.kol));
                        const res = this.returnEzKolvo(mA.ez, mat.ez_kolvo, mat.kolvo, count, count);
                        mat.kol = Number(mat.kol) + count; 
                        mat.ez_kolvo = res.ez_kolvo;
                        mat.kolvo = res.kolvo;
                        check = false;
                    }
                }
                if (check) {
                    const count = (Number(mat.kol) * Number(item.kol));
                    const res = this.returnEzKolvo(mat.ez, JSON.parse(EZ_KOLVO), JSON.parse(KOLVO), count, count);
                    materialsArr.push({
                        ...mat, 
                        kol: count,
                        ez_kolvo: res.ez_kolvo,
                        kolvo: res.kolvo
                    });
                }
                else check = true;
            }
        }

        const newArr = [];
        for (const item of materialsArr) {
            const material = (await this.material.findByPk(item.mat.id)).toJSON();
            if (material) {
                material['plan'] = {
                    ez_kolvo: item.ez_kolvo, 
                    kolvo: item.kolvo
                }
                newArr.push(material);
            }
        }
        
        return newArr;
    }

    returnEzKolvo (ez: number, ez_kolvo: any, kolvo: any, mr: number, sk: number) {
        switch(Number(ez)) {
            case 1:
                kolvo.c1 = true;
                ez_kolvo.c1_kolvo.min_remaining += Number(mr);
                ez_kolvo.c1_kolvo.shipments_kolvo += Number(sk);
            break;
            case 2:
                kolvo.c2 = true;
                ez_kolvo.c2_kolvo.min_remaining += Number(mr);
                ez_kolvo.c2_kolvo.shipments_kolvo += Number(sk);
            break;
            case 3:
                kolvo.c3 = true;
                ez_kolvo.c3_kolvo.min_remaining += Number(mr);
                ez_kolvo.c3_kolvo.shipments_kolvo += Number(sk);
            break;
            case 4:
                kolvo.c4 = true;
                ez_kolvo.c4_kolvo.min_remaining += Number(mr);
                ez_kolvo.c4_kolvo.shipments_kolvo += Number(sk);
            break;
            case 5:
                kolvo.c5 = true;
                ez_kolvo.c5_kolvo.min_remaining += Number(mr);
                ez_kolvo.c5_kolvo.shipments_kolvo += Number(sk);
            break;
            default:
                ez_kolvo.c1_kolvo.min_remaining += Number(mr);
                ez_kolvo.c1_kolvo.shipments_kolvo += Number(sk);
            break;
        }

        return { kolvo, ez_kolvo };
    }

    /**
     * Начальная функция для подсчета дифицита материала
     * @returns 
     */
    async writtingDeficitMaterials() {
        const material = await this.material.findAll({
            attributes: ['id', 'shipments_kolvo', 'material_kolvo', 'ez_kolvo'],
        });
        if (!material) return false;

        for (const item of material) {
            item.shipments_kolvo = 0;
            item.material_kolvo = 0;
            item.min_remaining = 0;
            item.ez_kolvo = EZ_KOLVO;
            await item.save();

            await this.getAllRemObjectForMat(item.id);
        }

        this.formingDeficitMaterial = false;
    }

    /**
     * Получаем все Объекты к которым принадлежит материал
     * @param mat_id 
     * @returns 
     */
    async getAllRemObjectForMat(mat_id: number) {
        const allData = await this.getMaterialParents(mat_id);

        for (const item of allData) {
            for (const mat of item.materialList) {
                if (!mat || !mat?.mat) continue; 
                if (mat.mat.id == mat_id) {
                    for (const res of item.materials) {
                        const material = await this.material.findByPk(res.id, {
                            attributes: ['ez_kolvo', 'id', 'shipments_kolvo', 'min_remaining', 'material_kolvo', 'kolvo']
                        });
                        if (!material) continue;
                        const { min_remaining, shipments_kolvo } = item;
                        await this.formationDeficitMaterial(mat, { min_remaining, shipments_kolvo }, material);
                    }
                }
            }
        }

        return true
    }
    
     /**
      * Сохраняем количество для каждой ЕИ Материала
      * @param materialObj { kol: number, ez: number }
      * @param vars { min_remaining: number, shipments_kolvo: number }
      * @param material: PodPodMaterial
      * @returns 
      */
	async formationDeficitMaterial(materialObj: any, vars: any, material: PodPodMaterial) {
        if (!materialObj) return false;

        try {
            let ez_kolvo = JSON.parse(material.ez_kolvo);
            let kolvo = JSON.parse(material.kolvo);
            
            let shipments_kolvo = (Math.round(materialObj.kol) * Number(vars.shipments_kolvo));
            if (shipments_kolvo < 1) shipments_kolvo = 0;
            let min_remaining = (Math.round(materialObj.kol) * Number(vars.min_remaining));
            if (min_remaining < 1) min_remaining = 0;

            if(!shipments_kolvo && !min_remaining) return false;

            material.shipments_kolvo += shipments_kolvo;
            material.min_remaining += min_remaining;

            const res = this.returnEzKolvo(Number(materialObj.ez), ez_kolvo, kolvo, min_remaining, shipments_kolvo);
            ez_kolvo = res.ez_kolvo;
            kolvo = res.kolvo;

            material.kolvo = JSON.stringify(kolvo);
            material.ez_kolvo = JSON.stringify(ez_kolvo);
        } catch(err) {console.error(err+ '\n\n\nERROR IN STR: 410 \n\n\n')}

        await material.save()
	}

    /**
     * 
     * @param mat_id 
     */
    async getMaterialParentsDeficit(mat_id: number) {
        const provider = await this.providerReprository.count({
            include: [{
                model: PodPodMaterial,
                where: {id: mat_id}
            }],
        });

        const allData = await this.getMaterialParents(mat_id, [{
            model: Product,
            attributes: ['id', 'name']
        }], true);

        const arr: any = []
        for (const item of allData) {
            if (item.products && !item.products.length) continue;
            arr.push(item);
        }

        allData.unshift({type: 'provider', count: provider});

        return allData;
    }

    /**
     * Получить количество к каждому заказу [+]
     * Отсортировать по заказам [+] Нужно умножать количество материала к Обекту на количество объектов к заказу
     * Отправить массив заказов
     * @param mat_id 
     */
     async getMaterialShipmentsAttations(mat_id: number) {
        const includes = [{
            model: Shipments,
            attributes: ['list_cbed_detal', 'list_hidden_cbed_detal', 'kol', 'id', 'date_shipments', 'number_order', 'date_order']
        }];

        try {
            const allArr: any = await this.getMaterialParents(mat_id, includes, false);
            const allData = [];
            for (const item of allArr) {
                if (!item || !item.shipments) continue;
                if (item.shipments.length) allData.push(item);
            }

            for (const item of allData) {
                for (const sh of item.shipments) {
                    sh.shipments_parents = 0;
                    sh.shipments_material = 0;
                    // Получаем количество
                    if(item.type == 'prod') 
                        sh.shipments_parents = Number(sh.kol || 0);

                    if(item.type == 'detal' || item.type == 'cbed') {
                        const shData = this.returnObjForListShipments(item.type, item.id, sh);
                        for (const sd of shData) {
                            sh.shipments_parents = Number(sd.kol || 0) ;
                        }
                    }
                    // Получаем количество материалов
                    for (const material of item.materialList) {
                        sh.shipments_material += (material.kol * sh.shipments_parents);
                    }
                }
            }

            // Сортируем заказы (чтобы не повторялись).
            const shipments = [];
            for (const item of allData) {
                for (const sh of item.shipments) {
                    let exist = false;
                    for (const sh_new of shipments) {
                        if (sh.id == sh_new.id) {
                            sh_new.shipments_parents += Number(sh.shipments_parents);
                            sh_new.shipments_material += Number(sh.shipments_material);
                            exist = true;
                        }
                    }

                    if(!exist) shipments.push(sh);
                    exist = false;
                }
            }
            return shipments;
        } catch(err) { console.error(err) }

        return [];
    }

    private async findParentsComplectMaterial(mat_id: number, includes: any = [], includesNoProduct: boolean = false) {
        const include = [{
            model: PodPodMaterial,
            where: {id: mat_id},
            attributes: ['id']
        }];
        if (includes.length && !includesNoProduct) include.push(...includes);

        const where = {ban: false} 
        const attrimbute = [
            'materialList', 
            'min_remaining', 
            'shipments_kolvo', 
            'min_remaining', 
            'name', 
            'id'
        ];
        
        const allProduct = await this.productReprository.findAll({include, 
            attributes: ['listPokDet', ...attrimbute], where
        });
        if (includes.length, includesNoProduct) include.push(...includes);
        const allCbed = await this.cbedReprository.findAll({include, 
            attributes: ['listPokDet', ...attrimbute], where
        });
        const allDetal = await this.detalReprository.findAll({include, 
            attributes: ['mat_zag', 'mat_zag_zam', 'massZag', 'lengt', ...attrimbute], where
        });

        const prod = JSON.parse(JSON.stringify(allProduct));
        const cbed = JSON.parse(JSON.stringify(allCbed));
        const detal = JSON.parse(JSON.stringify(allDetal));

        prod.forEach((el: any) => el['type'] = 'prod');
        cbed.forEach((el: any) => el['type'] = 'cbed');
        detal.forEach((el: any)=> el['type'] = 'detal');

        return { prod, cbed, detal };
    }

    private returnObjForListShipments(type: string, _id: number, sh: Shipments) {
        try {
            let arr = [];
            if (sh.list_cbed_detal) arr = JSON.parse(sh.list_cbed_detal);
            if (sh.list_hidden_cbed_detal) arr = arr.concat(JSON.parse(sh.list_hidden_cbed_detal));
            
            const objData = [];
            for (const item of arr) {
                if (item.type == type && _id == item.obj.id) objData.push(item);
            }

            return objData;
        } catch(err) {console.error(err)}
    }

    /**
     * Получаем родителей по принадлежности
     * к материалам. 
     */ 
    async getMaterialParents(mat_id: number, includes: any = [], includesNoProduct: boolean = false) {
        
        const { prod, cbed, detal }: any = await this.findParentsComplectMaterial(mat_id, includes, includesNoProduct);

        let allData = [];

        function returnObjMat(item: any, zag: any) {
            if (!zag) return item;
            item.materialList.push({
                mat: {id: zag},
                kol: 1,
                ez: 1
            });
            if (item.massZag)
                item.materialList.push({
                    mat: {id: zag},
                    kol: Math.round(item.massZag),
                    ez: 3
                });
            if (item.lengt) {
                item.materialList.push({
                    mat: {id: zag},
                    kol: Math.round(item.lengt),
                    ez: 4
                });
            }
            return item;
        }

        try {
            allData = [...prod, ...cbed, ...detal];;

            for (let item of allData) {
                if (item.materialList) 
                    item.materialList = JSON.parse(item.materialList);
                else item.materialList = [];
                if (item?.listPokDet && item.listPokDet)
                    item.listPokDet = JSON.parse(item.listPokDet);
                else item.listPokDet = [];

                item = returnObjMat(item, item?.mat_zag);
                item = returnObjMat(item, item?.mat_zag_zam);

                item.materialList = [...item.materialList, ...item.listPokDet].filter((el: any) => {
                    return el.mat && el.mat.id == mat_id;
                })
                delete item.listPokDet;

            } 
        } catch(e) {
            console.error(e);
            this.logger.error("Произошла ошибка service::getMaterialParents");
        }
       
        return allData;
    }

    // Сортировка материала по заказам 
    // Получить Все Изделия, СБ, Д и найти для них заказы
    async materialShipmentsToId(mat_id: number) {
        const allData = await this.getMaterialParents(mat_id, {
            model: Shipments
        });

        return allData;
    }
}
