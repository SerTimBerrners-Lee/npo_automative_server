import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cbed } from 'src/cbed/cbed.model';
import { CbedService } from 'src/cbed/cbed.service';
import { DetalService } from 'src/detal/detal.service';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { StatusAssemble, statusShipment } from 'src/files/enums';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { Product } from 'src/product/product.model';
import { SettingsService } from 'src/settings/settings.service';
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
		private cbedService: CbedService,
		private settingsService: SettingsService, 
		private detalService: DetalService, 
		private metaloworkingService: MetaloworkingService) {} 

	// Добавляем сборку
	async createAssemble(dto: CreateAssembleDto) {
		const assemble = await this.assembleReprository
			.create({
				date_order: dto.date_order,
				description: dto.description,
				type_izd: dto.type
			})
		if(!assemble)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY);
		
		assemble.number_order = dto.number_order.trim() + "_" + String(assemble.id);
		if(!dto.date_order) assemble.date_order = new Date().toLocaleString('ru-RU').split(',')[0];

		await assemble.save();

		if(!dto.cbed_id) return assemble;
		let cbed: Cbed | Product;
		if(dto.type == 'prod') 
			cbed = await this.productReprostory.findByPk(dto.cbed_id, {include: ['shipments']});
		else cbed = await this.cbedService.findById(dto.cbed_id, 'true')	;
		if(!cbed) return assemble;

		if(cbed.shipments?.length) 
			await this.shipmentsService.updateStatus(cbed.shipments, statusShipment.performed);

		assemble.cbed_id = cbed.id;
		assemble.kolvo_shipments = dto.my_kolvo;
		cbed.assemble_kolvo += dto.my_kolvo;
		await assemble.save();
		await cbed.save();

		return assemble;
	}

	async updateAssemble(dto: UpdateAssembleDto) {
		console.log(dto);
		
		const ass = await this.assembleReprository.findByPk(dto.ass_id);
		let izd: Cbed | Product;
		if(dto.ass_type == 'prod')
			izd = await this.productReprostory.findByPk(dto.cbed_id);
		else izd = await this.cbedService.findById(dto.cbed_id, 'true');

		if(!ass || !izd) 
			throw new HttpException('Не удалось найти Сборку или Сборочную Единицу', HttpStatus.BAD_REQUEST);

		const differece = Number(dto.kolvo_shipments) - ass.kolvo_shipments;
		if(differece < 0) {
			if(izd.assemble_kolvo - differece < 0)
				izd.assemble_kolvo = 0;
			else izd.assemble_kolvo -= differece;
		}  
		if(differece > 0) 
			izd.assemble_kolvo += differece;
		
		ass.description = dto.description;
		ass.kolvo_shipments = dto.kolvo_shipments;

		await ass.save();
		await izd.save();
		return ass;
	}

	// Получаем все Сборки 
	async getAllAssemble(isBan: boolean = false) {
		const assembly = await this.assembleReprository.findAll({include: [ {all: true}, 
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
			}
		], where: {ban: isBan}})
		// Фильтрация по операциям
		for(let obj of assembly) {
			if(!obj.cbed || !obj.cbed.techProcesses || !obj.cbed.techProcesses.operations.length) continue
			for(let i in obj.cbed.techProcesses.operations) {
				for(let j in obj.cbed.techProcesses.operations) {
					if(obj.cbed.techProcesses.operations[i].id < obj.cbed.techProcesses.operations[j].id) {
						const ggg = obj.cbed.techProcesses.operations[i]
						obj.cbed.techProcesses.operations[i] = obj.cbed.techProcesses.operations[j]
						obj.cbed.techProcesses.operations[j] = ggg
					}
				}
			}
		}
		
		return assembly
	}

	// Удаляем сборку
	async deleteAssembly(id: number) {
		const ass = await this.assembleReprository.findByPk(id, {include: {all: true}})
		if(!ass) throw new HttpException('Не удалось удалить Сборку', HttpStatus.BAD_REQUEST)
		if(!ass.ban) {
			ass.ban = true
			ass.status = StatusAssemble.ban
			await	ass.save()
			return id
		}	// Если значение не БАН - переводим в БАН и не отображаем

		if(!ass.cbed) return await this.assembleReprository.destroy({where: {id}}) // Удаляем саму сборку если нет СБ

		const cbed = await this.cbedService.getOneCbedById(ass.cbed.id)
		if(!cbed) return await this.assembleReprository.destroy({where: {id}}) // Если нет СБ удаляем сборку

		cbed.assemble_kolvo = cbed.assemble_kolvo - ass.kolvo_shipments < 0 ? 0 : cbed.assemble_kolvo - ass.kolvo_shipments
		await cbed.save()
		
		return await this.assembleReprository.destroy({where: {id}})
	}

	async combackeAssembly(id: number) {
		const ass = await this.assembleReprository.findByPk(id, {include: {all: true}})
		if(!ass) throw new HttpException('Не удалось вернуть Сборку из Архива', HttpStatus.BAD_REQUEST)

		ass.ban = false
		ass.status = StatusAssemble.performed
		await ass.save()
		return id
	}

	// Получаем сборку по ID 
	async getAssembleById(id:number) {
		return await this.assembleReprository.findByPk(id, {include: [{all: true}, 
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
			}
		]})
	}

	// Получаем сборки по операциям
	async getAssembleByOperation(op_id: number) {
		const assembles = await this.getAllAssemble()
		const arr = []
		for(let ass of assembles) {
			try {
				if(!ass.cbed || !ass.cbed.techProcesses) continue
				for(let operation of ass.cbed.techProcesses.operations) {
					if(operation.name == op_id) {
						const operation_new = {operation, ass}
						arr.push(operation_new)
					}
				}
			} catch (e) {console.error(e)}
		}
		return arr
	}
}
 