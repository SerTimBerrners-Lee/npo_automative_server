import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Cbed } from 'src/cbed/cbed.model';
import { CbedService } from 'src/cbed/cbed.service';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { StatusAssemble, statusShipment } from 'src/files/enums';
import { copyObject, moreMinusNum } from 'src/files/methods';
import { Product } from 'src/product/product.model';
import { Working } from 'src/sclad/working.model';
import { Shipments } from 'src/shipments/shipments.model';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { Assemble } from './assemble.model';
import { CreateAssembleDto } from './dto/create-assemble.dto';
import { UpdateAssembleDto } from './dto/update-assemble.dto';

@Injectable()
export class AssembleService {
	constructor(@InjectModel(Assemble) private assembleReprository: typeof Assemble,
		@Inject(forwardRef(()=> ShipmentsService))
		private shipmentsService: ShipmentsService,
		@InjectModel(Product) private productReprostory: typeof Product,
		private cbedService: CbedService) {} 

	// Добавляем сборку
	async createAssemble(dto: CreateAssembleDto) {
		if (!dto.cbed_id)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY);

		let cbedOrProduct: Cbed | Product;
		if (dto.type === 'prod')
			cbedOrProduct = await this.productReprostory.findByPk(dto.cbed_id);
		else cbedOrProduct = await this.cbedService.findById(dto.cbed_id, 'true')	;
		if (!cbedOrProduct)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY);

		const assemble = await this.assembleReprository
			.create({
				date_order: dto.date_order,
				description: dto.description,
				type_izd: dto.type || 'cbed'
			});
		if (!assemble)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY);
		
		assemble.number_order = dto.number_order.trim() + "_" + String(assemble.id);
		if (!dto.date_order) assemble.date_order = new Date().toLocaleString('ru-RU').split(',')[0];

		if (cbedOrProduct.id && dto.type === 'prod')
			assemble.product_id = cbedOrProduct.id;
		else if (cbedOrProduct.id && dto.type === 'cbed')
			assemble.cbed_id = cbedOrProduct.id;

		assemble.kolvo_shipments = dto.my_kolvo;
		cbedOrProduct.assemble_kolvo += dto.my_kolvo;
		await assemble.save();
		await cbedOrProduct.save();

		return assemble;
	}

	async updateAssemble(dto: UpdateAssembleDto) {
		const ass = await this.assembleReprository.findByPk(dto.ass_id);
		let izd: Cbed | Product;
		if (dto.ass_type == 'prod')
			izd = await this.productReprostory.findByPk(dto.cbed_id);
		else izd = await this.cbedService.findById(dto.cbed_id, 'true');

		if (!ass || !izd) 
			throw new HttpException('Не удалось найти Сборку или Сборочную Единицу', HttpStatus.BAD_REQUEST);

		const differece = Number(dto.kolvo_shipments) - ass.kolvo_shipments;
		if (differece < 0) {
			if (izd.assemble_kolvo - differece < 0)
				izd.assemble_kolvo = 0;
			else izd.assemble_kolvo -= differece;
		}  
		if (differece > 0) izd.assemble_kolvo += differece;
		
		ass.description = dto.description;
		ass.kolvo_shipments = dto.kolvo_shipments;

		await ass.save();
		await izd.save();
		return ass;
	}

	// Получаем все Сборки 
	async getAllAssemble(isBan: boolean = false, conducted: boolean = true) {
		const conduct = conducted ? { [Op.ne]: '' } : { [Op.ne]: StatusAssemble.сonducted }

		const getAssembly = await this.assembleReprository.findAll({include: [ {all: true}, 
			{
				model: Cbed, 
				include: ['documents', 
					{
					model: Shipments, 
					include: ['product'],
					}, 
					{
					model: TechProcess,
					include: [{
						model: Operation, 
						include: ['marks']
						}]
					}]
			},
			{
				model: Product, 
				include: ['documents', 
					{
					model: Shipments, 
					include: ['product'],
					}, 
					{
					model: TechProcess,
					include: [{
						model: Operation, 
						include: ['marks']
						}]
					}]
			}
		], where: {ban: isBan, status: conduct}});

		const assembly = copyObject(getAssembly);
		// Фильтрация по операциям
		for (const obj of assembly) {
			if (obj.type_izd === 'prod') {
				obj.cbed = obj.product;
				obj.cbed_id = obj.product_id;
			}
			if (!obj.cbed || !obj.cbed.techProcesses || !obj.cbed.techProcesses.operations.length) continue;
			for (let i in obj.cbed.techProcesses.operations) {
				for (let j in obj.cbed.techProcesses.operations) {
					if (obj.cbed.techProcesses.operations[i].id < obj.cbed.techProcesses.operations[j].id) {
						const ggg = obj.cbed.techProcesses.operations[i];
						obj.cbed.techProcesses.operations[i] = obj.cbed.techProcesses.operations[j];
						obj.cbed.techProcesses.operations[j] = ggg;
					}
				}
			}
		}
		 
		return assembly;
	}

	async getAllAssemblePlan(type: string = 'all') {
		const where = { ban: false };
		if (type !== 'all') where['type_izd'] = type;

		const getAssembly = await this.assembleReprository.findAll({ 
			where,
			include: [
				{
					model: Cbed,
					attributes: ['id', 'name', 'articl', 'shipments_kolvo'],
					include: [{
						model: Shipments
					}]
				},
				{
					model: Working
				},
				{
					model: Product,
					attributes: ['id', 'name', 'articl', 'shipments_kolvo'],
					include: [{
						model: Shipments
					}]
				},
				{
					model: Working
				},
		]});

		const assembly = copyObject(getAssembly);
		for (const obj of assembly) {
			if (obj.type_izd === 'prod') {
				obj.cbed = obj.product;
				obj.cbed_id = obj.product_id;
			}
		}
		if (!assembly)
			throw new HttpException('Не удалось получить сборки', HttpStatus.NOT_FOUND);

		return assembly;
	}

	// Кидаем сборку в бан.
	async deleteAssembly(id: number) {
		const ass = await this.assembleReprository.findByPk(id, {include: {all: true}});
		if (!ass) throw new HttpException('Не удалось получить Сборку', HttpStatus.BAD_REQUEST);

		if (!ass.cbed || !ass.product) throw new HttpException('СБ ед. не прекреплена к СБорке', HttpStatus.BAD_REQUEST); // Удаляем саму сборку если нет СБ

		const izd = ass.type_izd === 'prod' ? await this.productReprostory.findByPk(ass.product_id) : await this.cbedService.getOneCbedById(ass.cbed_id, true);
		if (!izd) throw new HttpException('Не удалось получить СБ ед.', HttpStatus.BAD_REQUEST); // Если нет СБ удаляем сборку

		ass.ban = !ass.ban;
		if (!ass.ban) {
			ass.status = StatusAssemble.ban;
			izd.assemble_kolvo = moreMinusNum(izd.assemble_kolvo - ass.kolvo_shipments);
		}
		else {
			ass.status = StatusAssemble.performed; // Сделать проверку на просрочку!
			izd.assemble_kolvo += ass.kolvo_shipments;
		}

		izd.$remove('assemble', ass.id);
		await izd.save();
		await ass.save();

		return ass;
	}

	async combackeAssembly(id: number) {
		const ass = await this.assembleReprository.findByPk(id, {include: {all: true}});
		if (!ass) throw new HttpException('Не удалось вернуть Сборку из Архива', HttpStatus.BAD_REQUEST);

		ass.ban = false;
		ass.status = StatusAssemble.performed;
		await ass.save();
		return id;
	}

	// Получаем сборку по ID 
	async getAssembleById(id:number) {
		const result = await this.assembleReprository.findByPk(id, {include: [{all: true}, 
			{
				model: Cbed, 
				include: ['documents', 
					{
					model: Shipments, 
					include: ['product', 'buyer'],
					}, 
					{
					model: TechProcess,
					include: [{
						model: Operation, 
						include: ['marks']
						}]
					}]
			},
			{
				model: Product, 
				include: ['documents', 
					{
					model: Shipments, 
					include: ['product', 'buyer'],
					}, 
					{
					model: TechProcess,
					include: [{
						model: Operation, 
						include: ['marks']
						}]
					}]
			}
		]});

		const assembly = copyObject(result);

		if (assembly.type_izd === 'prod') {
			assembly.cbed = assembly.product;
			assembly.cbed_id = assembly.product_id;
		}

		return assembly;
	}

	// Получаем сборки по операциям
	async getAssembleByOperation(op_id: number) {
		const assembles = await this.getAllAssemble();
		const arr = [];
		for (const ass of assembles) {
			try {
				if(!ass.cbed || !ass.cbed.techProcesses) continue
				for (const operation of ass.cbed.techProcesses.operations) {
					if (operation.name == op_id) {
						const operation_new = {operation, ass}
						arr.push(operation_new);
					}
				}
			} catch (e) {console.error(e)}
		}
		return arr;
	}
}
 