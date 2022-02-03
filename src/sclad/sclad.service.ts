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
import { StatusAssemble, StatusMetaloworking } from 'src/files/enums';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { Product } from 'src/product/product.model';
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
}
