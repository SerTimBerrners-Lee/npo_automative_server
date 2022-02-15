import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import process from 'process';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Where } from 'sequelize/types/lib/utils';
import { Assemble } from 'src/assemble/assemble.model';
import { AssembleService } from 'src/assemble/assemble.service';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { TypeOperation } from 'src/detal/type-operation.model';
import { EZ_KOLVO, StatusAssemble, StatusMetaloworking } from 'src/files/enums';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { Product } from 'src/product/product.model';
import { Providers } from 'src/provider/provider.model';
import { Material } from 'src/settings/material.model';
import { PodMaterial } from 'src/settings/pod-material.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { Shipments } from 'src/shipments/shipments.model';
import { User } from 'src/users/users.model';
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
        @InjectModel(Shipments) private shipmentsReprository: typeof Shipments,
        private assembleService: AssembleService,
        private metaloworkingService: MetaloworkingService,
        ) {
            this.logger = new Logger()
        }

    private logger: Logger

    async updateDeficit(dto: UpdateDeficitDto) {
        const deficit = await this.deficitReprository.update(
            { minRemainder: dto.minRemainder, recommendedRemainder: dto.recommendedRemainder }, 
            { where: {id: dto.id} })
                
        if(!deficit)
            throw new HttpException('Не удалось обновить таблицу дефицита', HttpStatus.BAD_REQUEST)
        return deficit;
    }

    async getDeficit() {
        return await this.deficitReprository.findAll({include: {all: true}})
    }

    async createMark(dto: CreateMarkDto) {
       const mark = await this.marksReprository.create(dto)
        if(!mark) 
            throw new HttpException('Произошла ошибка при добавлении отметки.', HttpStatus.BAD_REQUEST)

        await this.checkStatusProcess(dto)
        return mark
    }

    async getMarks() {
        return await this.marksReprository.findAll({include: {all: true}})
    }

    private async checkStatusProcess(dto: CreateMarkDto) {
        let objects: any;
        let tp: TechProcess
        if(dto.assemble_id) objects = await this.assembleService.getAssembleById(dto.assemble_id)
        if(dto.metaloworking_id) objects = await this.metaloworkingService.getOneMetaloworkingById(dto.metaloworking_id)
        if(!objects) 
            throw new HttpException('Произошла ошибка при добавлении отметки2.', HttpStatus.BAD_REQUEST)

        if(dto.assemble_id) 
            if(objects.cbed && objects.cbed.techProcesses) tp = objects.cbed.techProcesses
        if(dto.metaloworking_id) 
            if(objects.detal && objects.detal.techProcesses) tp = objects.detal.techProcesses
            
        if(!tp || !tp.operations || !tp.operations.length) 
            throw new HttpException('Произошла ошибка при добавлении отметки.', HttpStatus.BAD_REQUEST)
            
        let create_marks = 0
        for(let oper of tp.operations) {
            let kol = 0
            for(let mark of oper.marks) {
                kol = kol + mark.kol
            }
            if(objects.kolvo_shipments <= kol) create_marks++
        }
        if(create_marks >= tp.operations.length) {
            if(dto.assemble_id) objects.status = StatusAssemble[1]
            if(dto.metaloworking_id) objects.status = StatusMetaloworking[1]
        }
        await objects.save()
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
                attributes: ['kol', 'id']
            }]
        })

        for(const item of products) {
            try {
                const har = JSON.parse(item.haracteriatic)[1].znach
                item.min_remaining = Number(har)
                
                item.shipments_kolvo = 0
                if(item.shipments.length) {
                    for(const sh of item.shipments) {
                        item.shipments_kolvo += Number(sh.kol)
                    }
                }
                console.log('\n\n\n', item.shipments, '\n\n\n')
                await item.save()
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
        })
    }

    async getAllDeficitCbed() {
		const cbeds = await this.cbedReprository.findAll({
            attributes: {exclude: ['attention', 'haracteriatic', 'parametrs', 'description']},
            include: {
                model: Shipments,
                attributes: ['id', 'list_cbed_detal', 'list_hidden_cbed_detal']
            }
        })

        for(let inx in cbeds) {
            const remaining = await this.minRemainder(cbeds[inx], 'cbed')
            let shipments_kolvo = await this.getIzdInShipmentsList(cbeds[inx].shipments, cbeds[inx].id, 'cbed');

            cbeds[inx].min_remaining = remaining
            cbeds[inx].shipments_kolvo = shipments_kolvo
            await cbeds[inx].save() 
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
        })

        return deficitCbed
	}

    async getAllDeficitDetal() {
        const detals = await this.detalReprository.findAll({
            attributes: {exclude: ['attention', 'haracteriatic', 'parametrs', 'description']},
            include: {
                model: Shipments,
                attributes: ['id', 'list_cbed_detal', 'list_hidden_cbed_detal']
            }
        }) 

        for(let inx in detals) {
            const remaining = await this.minRemainder(detals[inx], 'detal')
            let shipments_kolvo = await this.getIzdInShipmentsList(detals[inx].shipments, detals[inx].id, 'detal');
            
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
        })

        return deficitDetal
	}

    async getIzdInShipmentsList(shipments: any, izd_id: number, type: string) {
        let shipments_kolvo = 0

        for(const item of shipments) {
            let arr = [];
            if(item.list_cbed_detal) arr = JSON.parse(item.list_cbed_detal) 
            if(item.list_hidden_cbed_detal) arr = arr.concat(JSON.parse(item.list_hidden_cbed_detal))

            for(const izd of arr) {
                if(izd['obj'].id == izd_id && izd['type'] == type) {
                    shipments_kolvo += Number(izd['kol'])
                }
            }
        }
        return shipments_kolvo
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
            query['where'] = { id: list_id_arr }
            try {
                const cbeds = JSON.parse(izd.cbed)
                for(const cb of cbeds) {
                    list_id_arr.push(cb.id)
                }
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
                    if(item[keyList].id == izd.id && Number(item.kol)) 
                        remainder += Number(item.kol) * await this.getMinProductRemain(cb.id, 0, 'listCbed', 'cbed', 'cb')
                }
            } catch(err) {this.logger.error("\n\n\nISERROR\n\n\n", err)}
        }
        return remainder 
        
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
                const haracteriatic = JSON.parse(item.haracteriatic)[1].znach
                const listIzd = JSON.parse(item[listType])
                for(const item of listIzd) {
                    if(item[keyList].id == izd_id && haracteriatic > 0)
                        remainder += Number(item.kol) * Number(haracteriatic)
                }
            } catch(e) {console.error(e)}
        }

        return remainder
    }

    // return object in list  
    searchIzdToList(izd_id: number, type: string, list: any): object {
        for(let item of list) {
            if(izd_id == item.obj.id && type == item.type) return item
        }
        return undefined;	
    }

    // Deficit  materials
    async getAllMaterialDeficit() {
        await this.writtingDeficitMaterials()
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

        if(!materials)
            throw new HttpException('Произошла ошибка при получении дефицита. ', HttpStatus.BAD_REQUEST)

        return materials
    }

    // Начальная функция для подсчета дифицита 
    async writtingDeficitMaterials() {
        const material = await this.material.findAll({
            attributes: ['id', 'shipments_kolvo', 'material_kolvo', 'ez_kolvo'],
        })
        if(!material) return false;

        for(const item of material) {
            item.shipments_kolvo = 0
            item.material_kolvo = 0
            item.min_remaining = 0
            item.ez_kolvo = EZ_KOLVO
            await item.save()

            await this.getAllRemObjectForMat(item.id)
        }
    }

    // Получаем все Объекты к которым принадлежит материал
    async getAllRemObjectForMat(mat_id: number) {
        const allData = await this.getMaterialParents(mat_id);

        for(const item of allData) {
            for(const mat of item.materialList) {
                if(!mat || !mat?.mat) continue; 
                if(mat.mat.id == mat_id) {
                    for(const res of item.materials) {
                        const material = await this.material.findByPk(res.id, {
                            attributes: ['ez_kolvo', 'id', 'shipments_kolvo', 'min_remaining', 'material_kolvo', 'kolvo']
                        })
                        let {min_remaining, shipments_kolvo} = item
                        await this.formationDeficitMaterial(mat, {min_remaining, shipments_kolvo}, material)
                    }
                }
            }
        }

        return true
    }
    
     // Сохраняем количество для каждой ЕИ Материала
	async formationDeficitMaterial(materialObj: any, vars: any, material: PodPodMaterial) {
        if(!materialObj) return false;

        let ez_kolvo = material.ez_kolvo;
        let kolvo = material.kolvo
        try {
            ez_kolvo = JSON.parse(ez_kolvo)
            kolvo = JSON.parse(kolvo)
            
            let shipments_kolvo = (Math.round(materialObj.kol) * Number(vars.shipments_kolvo))
            if(shipments_kolvo < 1) shipments_kolvo = 0
            let min_remaining = (Math.round(materialObj.kol) * Number(vars.min_remaining))
            if(min_remaining < 1) min_remaining = 0

            if(!shipments_kolvo && !min_remaining) return false;

            material.shipments_kolvo += shipments_kolvo
            material.min_remaining += min_remaining


            switch(Number(materialObj.ez)) {
                case 1:
                    kolvo.c1 = true
                    ez_kolvo.c1_kolvo.min_remaining += min_remaining
                    ez_kolvo.c1_kolvo.shipments_kolvo += shipments_kolvo
                break;
                case 2:
                    kolvo.c2 = true
                    ez_kolvo.c2_kolvo.min_remaining += min_remaining
                    ez_kolvo.c2_kolvo.shipments_kolvo += shipments_kolvo
                break;
                case 3:
                    kolvo.c3 = true
                    ez_kolvo.c3_kolvo.min_remaining += min_remaining
                    ez_kolvo.c3_kolvo.shipments_kolvo += shipments_kolvo
                break;
                case 4:
                    kolvo.c4 = true
                    ez_kolvo.c4_kolvo.min_remaining += min_remaining
                    ez_kolvo.c4_kolvo.shipments_kolvo += shipments_kolvo
                break;
                case 5:
                    kolvo.c5 = true
                    ez_kolvo.c5_kolvo.min_remaining += min_remaining
                    ez_kolvo.c5_kolvo.shipments_kolvo += shipments_kolvo
                break;
                default:
                    ez_kolvo.c1_kolvo.min_remaining += min_remaining
                    ez_kolvo.c1_kolvo.shipments_kolvo += shipments_kolvo
                break;
            }
            
            material.kolvo = JSON.stringify(kolvo)
            material.ez_kolvo = JSON.stringify(ez_kolvo)
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

        let allData = await this.getMaterialParents(mat_id, [{
            model: Product,
            attributes: ['id', 'name']
        }], true)

        let arr: any = []
        for(const item of allData) {
            if(item.products && !item.products.length) continue;
            arr.push(item)
        }

        allData.unshift({type: 'provider', count: provider})

        return allData
    }

    /**
     * 
     * @param mat_id 
     */
     async getMaterialShipmentsAttations(mat_id: number) {
        // 1. Получить количество к каждому заказу [+]
        // 2. Отсортировать по заказам [+] Нужно умножать количество материала к Обекту на количество объектов к заказу
        // 3. Отправить массив заказов
        const includes = [{
            model: Shipments,
            attributes: ['list_cbed_detal', 'list_hidden_cbed_detal', 'kol', 'id', 'date_shipments', 'number_order', 'date_order']
        }];

        try {
            const allArr: any = await this.getMaterialParents(mat_id, includes, false);
            let allData = [];
            for(let item of allArr) {
                if(!item || !item.shipments) continue;
                if(item.shipments.length) allData.push(item) 
            }

            for(let item of allData) {
                for(const sh of item.shipments) {
                    sh.shipments_parents = 0;
                    sh.shipments_material = 0;
                    // Получаем количество 
                    if(item.type == 'prod') {
                        sh.shipments_parents = Number(sh.kol || 0) 
                    }
                    if(item.type == 'detal' || item.type == 'cbed') {
                        const shData = this.returnObjForListShipments(item.type, item.id, sh);
                        for(const sd of shData) {
                            sh.shipments_parents = Number(sd.kol || 0) 
                        }
                    }
                    // Получаем количество материалов
                    for(let material of item.materialList) {
                        sh.shipments_material += (material.kol * sh.shipments_parents)
                    }
                }
            }

            // Сортируем заказы (чтобы не повторялись).
            let shipments = [];
            for(const item of allData) {
                for(const sh of item.shipments) {
                    let exist = false
                    for(const sh_new of shipments) {
                        if(sh.id == sh_new.id) {
                            sh_new.shipments_parents += Number(sh.shipments_parents)
                            sh_new.shipments_material +=Number(sh.shipments_material)
                            exist = true
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
        }]
        if(includes.length && !includesNoProduct) include.push(...includes)

        const where = {ban: false} 
        const attrimbute = [
            'materialList', 
            'min_remaining', 
            'shipments_kolvo', 
            'min_remaining', 
            'name', 
            'id'
        ]
        
        const allProduct = await this.productReprository.findAll({include, 
            attributes: ['listPokDet', ...attrimbute], where
        })
        if(includes.length, includesNoProduct) include.push(...includes)
        const allCbed = await this.cbedReprository.findAll({include, 
            attributes: ['listPokDet', ...attrimbute], where
        })
        const allDetal = await this.detalReprository.findAll({include, 
            attributes: ['mat_zag', 'mat_zag_zam', 'massZag', 'lengt', ...attrimbute], where
        })

        const prod = JSON.parse(JSON.stringify(allProduct))
        const cbed = JSON.parse(JSON.stringify(allCbed))
        const detal = JSON.parse(JSON.stringify(allDetal))

        prod.forEach((el: any) => el['type'] = 'prod')
        cbed.forEach((el: any) => el['type'] = 'cbed')
        detal.forEach((el: any)=> el['type'] = 'detal')

        return { prod, cbed, detal }
    }

    private returnObjForListShipments(type: string, _id: number, sh: Shipments) {
        try {
            let arr = [];
            if(sh.list_cbed_detal) arr = JSON.parse(sh.list_cbed_detal);
            if(sh.list_hidden_cbed_detal) arr = arr.concat(JSON.parse(sh.list_hidden_cbed_detal));
            
            let objData = [];
            for(const item of arr) {
                if(item.type == type && _id == item.obj.id) objData.push(item)
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

        let allData = []

        function returnObjMat(item: any, zag: any) {
            if(!zag) return item;
            item.materialList.push({
                mat: {id: zag},
                kol: 1,
                ez: 1
            })
            if(item.massZag)
                item.materialList.push({
                    mat: {id: zag},
                    kol: Math.round(item.massZag),
                    ez: 3
                })
            if(item.lengt) {
                item.materialList.push({
                    mat: {id: zag},
                    kol: Math.round(item.lengt),
                    ez: 2
                })
            }
            return item
        }

        try {
            allData = [...prod, ...cbed, ...detal];

            for(let item of allData) {
                if(item.materialList) 
                    item.materialList = JSON.parse(item.materialList)
                else item.materialList = []
                if(item?.listPokDet && item.listPokDet)
                    item.listPokDet = JSON.parse(item.listPokDet)
                else item.listPokDet = []

                item = returnObjMat(item, item?.mat_zag)
                item = returnObjMat(item, item?.mat_zag_zam)

                item.materialList = [...item.materialList, ...item.listPokDet].filter((el: any) => {
                    return el.mat && el.mat.id == mat_id
                })
                delete item.listPokDet

            } 
        } catch(e) {
            console.error(e)
            this.logger.error("Произошла ошибка service::getMaterialParents")
        }
       
        return allData
    }

    // Сортировка материала по заказам 
    // Получить Все Изделия, СБ, Д и найти для них заказы
    async materialShipmentsToId(mat_id: number) {
        const allData = await this.getMaterialParents(mat_id, {
            model: Shipments
        })

        return allData
    }
}
