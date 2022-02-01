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
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY)
		

		assemble.number_order = String(assemble.id) + dto.number_order.trim()
		if(!dto.date_order) assemble.date_order = new Date().toLocaleString('ru-RU').split(',')[0]

		await assemble.save()

		if(!dto.cbed_id) return assemble
		let cbed: Cbed | Product;
		if(dto.type == 'prod') 
			cbed = await this.productReprostory.findByPk(dto.cbed_id, {include: ['shipments']})
		else cbed = await this.cbedService.findById(dto.cbed_id, 'true')	
		if(!cbed) return assemble

		if(cbed.shipments?.length) 
			await this.shipmentsService.updateStatus(cbed.shipments, statusShipment.performed)

		let differece = cbed.assemble_kolvo
		assemble.cbed_id = cbed.id
		assemble.kolvo_shipments = dto.my_kolvo
		cbed.assemble_kolvo = cbed.assemble_kolvo + dto.my_kolvo
		await assemble.save()

		// shipments_kolvo -- сколько заказано в задачах на отгрузку (Дефицит)
		// my_kolvo -- которое мы указали для производства
		// assemble_kolvo -- всего заказано на производстве в СБОРКЕ
			
		const result = await this.middlewareUpdate(assemble, cbed, dto.my_kolvo, differece)
		return result
	}

	private async middlewareUpdate(ass: Assemble, cbed: Cbed | Product, my_kolvo: number, differece: number) {
		const all_kolvo_metal = await this.assembleReprository.findAll({attributes: ['cbed_id', 'kolvo_shipments', 'id'], where: {cbed_id: cbed.id}})
		let count_ass = 0 // Количество уже заказанных
		for(let item of all_kolvo_metal) {
			count_ass  += item.kolvo_shipments 
		}

		if(count_ass < cbed.shipments_kolvo) { 
			// Нудно учесть тот факт что удалении из дефицита заказанного после оно в дефицит не уйдет!!!
			let num = 0
			if(Number(my_kolvo) > cbed.shipments_kolvo) num = Number(my_kolvo) - cbed.shipments_kolvo
			else if(count_ass + Number(my_kolvo) > cbed.shipments_kolvo)
				num = (count_ass + Number(my_kolvo)) - cbed.shipments_kolvo

			await this.countFunction(cbed, num)
			await cbed.save()
			await ass.save()
			
			return ass
		} 
		if(count_ass <= cbed.shipments_kolvo) return ass	 

		let count = Number(cbed.assemble_kolvo) - differece == 0 ? -1 : Number(cbed.assemble_kolvo) - differece

		await this.countFunction(cbed, count)
		await cbed.save()
		await ass.save()
		
		return ass
	}

	async updateAssemble(dto: UpdateAssembleDto) {
		const ass = await this.assembleReprository.findByPk(dto.ass_id)
		const cbed = await this.cbedService.getOneCbedById(dto.cbed_id, true)
		if(!ass || !cbed) 
			throw new HttpException('Не удалось найти Сборку или Сборочную Единицу', HttpStatus.BAD_REQUEST)

		let differece = dto.kolvo_shipments - ass.kolvo_shipments 
		let last_count = cbed.assemble_kolvo
		if(differece < 0)  {
			cbed.assemble_kolvo -= differece
			await this.countFunction(cbed, -differece)
		}
		else if(differece > 0) {
			cbed.assemble_kolvo += differece
			await this.middlewareUpdate(ass, cbed, differece, last_count)
		}

		ass.description = dto.description
		ass.kolvo_shipments = dto.kolvo_shipments

		await ass.save()
		await cbed.save()
		return ass
	}

	private async countFunction(cbed: Cbed | Product, differenc: number) {
		await this.shipmentsMaterialsForIzd(cbed, differenc)
		if(cbed.listDetal)
			await this.parseDetalJson(cbed.listDetal, differenc)
		if(cbed.listCbed)
			await this.parseCbedJson(cbed.listCbed, differenc)
	}

	// Промежуточная функция Проверка на покупные и просто материалы
	async shipmentsMaterialsForIzd(izd: Cbed | Product, kolvo_all: any = 1) {
		if(izd.materialList) 
			await this.settingsService.formationDeficitMaterial(izd.materialList, kolvo_all)
		if(izd.listPokDet) 
			await this.settingsService.formationDeficitMaterial(izd.listPokDet, kolvo_all)
	}

	// Парсим Детали
	async parseDetalJson(list_json_detal: string, kolvo_all: any = 1) {
		try {
			const pars_det = JSON.parse(list_json_detal)
			if(pars_det.length) {
				for(let detal of pars_det) {
					let det_check = await this.detalService.findByIdDetal(detal.det.id)
					if(det_check) {
						let deficit = detal.kol * kolvo_all
						det_check.shipments_kolvo = det_check.shipments_kolvo + deficit
						await det_check.save()
						await this.metaloworkingService.shipmentsMaterialsForDetal(det_check, deficit)
					}
				}
			}
		} catch(e) {
			console.error(e)
		}
	}

	// Парсим также Сборки
	async parseCbedJson(list_json_cbed: string, kolvo_all: any = 1) {
		try {
			let pars_cbed = JSON.parse(list_json_cbed)
			for(let cbed of pars_cbed) {
				const cbed_check = await this.cbedService.findById(cbed.cb.id)
				if(cbed_check) {
					let deficit = cbed.kol * kolvo_all
					cbed_check.shipments_kolvo = cbed_check.shipments_kolvo + deficit
					await cbed_check.save()
					
					await this.shipmentsMaterialsForIzd(cbed_check, deficit)
					if(cbed_check.listDetal)
						await this.parseDetalJson(cbed_check.listDetal, deficit)
					if(cbed_check.listCbed)
						await this.parseCbedJson(cbed_check.listCbed, deficit)
				}
			}
		} catch(e) {
			console.error(e)
		}
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
		await this.countFunction(cbed, -ass.kolvo_shipments)

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
 