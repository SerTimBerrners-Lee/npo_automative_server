import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
import { Material } from 'src/settings/material.model';
import { PodMaterial } from 'src/settings/pod-material.model';
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
        @InjectModel(PodPodMaterial) private material: typeof PodPodMaterial,
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
            attributes: ['haracteriatic', 'id', 'product_kolvo', 'shipments_kolvo']
        })

        let arrIdProducts = [];

        for(const item of products) {
            try {
                const har = JSON.parse(item.haracteriatic)[1].znach
                if(item.min_remaining != Number(har)) {
                    item.min_remaining = Number(har)
                    await item.save()
                }
                if((item.product_kolvo - item.shipments_kolvo) < har) arrIdProducts.push(item.id)
            } catch(e) {console.error(e)}
        }

        return await this.productReprository.findAll({
            include: [
                {
                    model: TechProcess
                },
                'shipments' 
            ],
            where: {
                id: arrIdProducts
            }
        })
    }

    async getAllDeficitCbed() {
		const cbeds = await this.cbedReprository.findAll({
            attributes: {exclude: ['attention', 'haracteriatic', 'parametrs', 'description']}
        })

        for(let inx in cbeds) {
            const remaining = await this.minRemainder(cbeds[inx], 'cbed')
            cbeds[inx].min_remaining = remaining
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
            attributes: {exclude: ['attention', 'haracteriatic', 'parametrs', 'description']}
        })

        for(let inx in detals) {
            const remaining = await this.minRemainder(detals[inx], 'detal')
            detals[inx].min_remaining = remaining 
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
                    if(item[keyList].id == izd_id)
                        remainder += Number(item.kol) * (haracteriatic || 1)
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
            include: [
                {model: Material},
                {model: PodMaterial}
            ],
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
        if(materialObj.ez != 1) console.log('ez\n\n\n', materialObj, '\n\n\n')

        let ez_kolvo = material.ez_kolvo;
        let kolvo = material.kolvo
        try {
            ez_kolvo = JSON.parse(ez_kolvo)
            kolvo = JSON.parse(kolvo)
            
            let shipments_kolvo = (Math.round(materialObj.kol) * Number(vars.shipments_kolvo)) * 2
            if(shipments_kolvo < 1) shipments_kolvo = 1
            let min_remaining = (Math.round(materialObj.kol) * Number(vars.min_remaining)) * 2
            if(min_remaining < 1) min_remaining = 1

            material.shipments_kolvo += shipments_kolvo
            material.min_remaining += min_remaining

            if(!shipments_kolvo && !min_remaining) return false;

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
     * Получаем родителей по принадлежности
     * к материалам. 
     */
    async getMaterialParents(mat_id: number, includes: any = []) {
        const include = [{
            model: PodPodMaterial,
            where: {id: mat_id},
            attributes: ['id']
        }]

        if(includes.length) include.push(...includes)

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
        const allCbed = await this.cbedReprository.findAll({include, 
            attributes: ['listPokDet', ...attrimbute], where
        })
        const allDetal = await this.detalReprository.findAll({include, 
            attributes: ['mat_zag', 'mat_zag_zam', ...attrimbute], where
        })

        let allData = []

        try {
            const prod = JSON.parse(JSON.stringify(allProduct))
            const cbed = JSON.parse(JSON.stringify(allCbed))
            const detal = JSON.parse(JSON.stringify(allDetal))

            prod.forEach((el: any) => el['type'] = 'prod')
            cbed.forEach((el: any) => el['type'] = 'cbed')
            detal.forEach((el: any)=> el['type'] = 'detal')

            allData = [...prod, ...cbed, ...detal];

            for(const item of allData) {
                if(item.materialList) 
                    item.materialList = JSON.parse(item.materialList)
                else item.materialList = []
                if(item?.listPokDet && item.listPokDet)
                    item.listPokDet = JSON.parse(item.listPokDet)
                else item.listPokDet = []

                if(item.mat_zag) item.materialList.push({
                    mat: {id: item.mat_zag},
                    kol: 1,
                    ez: 1
                })
                if(item.mat_zag_zam) item.materialList.push({
                    mat: {id: item.mat_zag_zam},
                    kol: 1,
                    ez: 1
                })

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
        console.log(allData)

        return allData
    }
}
