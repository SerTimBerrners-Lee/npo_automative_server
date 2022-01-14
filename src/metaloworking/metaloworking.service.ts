import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Detal } from 'src/detal/detal.model';
import { DetalService } from 'src/detal/detal.service';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { ProductService } from 'src/product/product.service';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { SettingsService } from 'src/settings/settings.service';
import { Shipments } from 'src/shipments/shipments.model';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
import { Metaloworking } from './metaloworking.model';

@Injectable()
export class MetaloworkingService {
	constructor(
		@InjectModel(Metaloworking) private metaloworkingReprositroy: typeof Metaloworking,  
		@Inject(forwardRef(() => ShipmentsService))
		private shipmentService: ShipmentsService,
		private detalService: DetalService,
		private settingsService: SettingsService,
		private productService: ProductService) {}

	async createMetaloworking(dto: CreateMetaloworkingDto) {
		const metaloworking = await this.metaloworkingReprositroy
			.create({
				date_order: dto.date_order,
				description: dto.description 
			})
		if(!metaloworking)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY)

		if(!dto.number_order) 
			metaloworking.number_order = String(metaloworking.id)
		if(!dto.date_order) metaloworking.date_order = new Date().toLocaleString('ru-RU').split(',')[0]
		else metaloworking.number_order = dto.number_order

		await metaloworking.save()

		if(!dto.detal_id) return metaloworking
		const detal = await this.detalService.findByIdDetal(dto.detal_id)
		if(!detal) return metaloworking

		metaloworking.detal_id = detal.id
		metaloworking.kolvo_shipments = dto.my_kolvo
		detal.metalloworking_kolvo = detal.metalloworking_kolvo + dto.my_kolvo

		if(dto.my_kolvo > detal.shipments_kolvo) 
			await this.shipmentsMaterialsForDetal(detal, (Number(dto.my_kolvo) - Number(detal.shipments_kolvo)))
		else if(detal.metalloworking_kolvo > dto.shipments_kolvo)
			await this.shipmentsMaterialsForDetal(detal, Number(dto.my_kolvo))
		await detal.save()

		await metaloworking.save()
		return metaloworking
	}

	// Формируем дефицит для заготовки зам заготовки и всех прикрепленных материаов
	async shipmentsMaterialsForDetal(detal: Detal, kolvo_all: any) {
		if(detal.mat_zag)  // Заготовку или заменитель заготовки тоже кидаем в дефицит 
			this.formationDeficitZagMaterial(detal.mat_zag, kolvo_all)
		if(detal.mat_zag_zam) 
			this.formationDeficitZagMaterial(detal.mat_zag_zam, kolvo_all)
		if(detal.materialList) 
			await this.settingsService.formationDeficitMaterial(detal.materialList, kolvo_all)
	}

	private async formationDeficitZagMaterial(material_zag: any, kolvo_all: number) {
		const mat_zag = await this.settingsService.getOnePPT(material_zag)
		if(!mat_zag) return false

		try{
			const pars_ez = JSON.parse(mat_zag.ez_kolvo)
			const kolvo = JSON.parse(mat_zag.kolvo) // Проверяем если "штука" в ЕИ не выставлена у заготовки - выставляем
			if(!kolvo.c1) kolvo.c1 = true

			pars_ez.c1_kolvo.shipments_kolvo = Number(pars_ez.c1_kolvo.shipments_kolvo) + (1* kolvo_all)
			mat_zag.ez_kolvo = JSON.stringify(pars_ez)
			mat_zag.kolvo = JSON.stringify(kolvo)
			mat_zag.shipments_kolvo = mat_zag.shipments_kolvo + (1 * kolvo_all)
		} catch(e) {console.error(e)}

		await mat_zag.save()
	}

	async deleteMetolloworking(id: number) {
		const metalloworking = await this.metaloworkingReprositroy.findByPk(id)
		if(!metalloworking) throw new HttpException('Не удалось удалить металообработки', HttpStatus.BAD_REQUEST)
		
		if(!metalloworking.detal) return await this.metaloworkingReprositroy.destroy({where: {id}})

		const detal = await this.detalService.findByIdDetal(metalloworking.detal.id)
		if(!detal) return await this.metaloworkingReprositroy.destroy({where: {id}})
		detal.metalloworking_kolvo = detal.metalloworking_kolvo - metalloworking.kolvo_shipments < 0 
			? 0 : detal.metalloworking_kolvo - metalloworking.kolvo_shipments
		await detal.save()
		
		return await this.metaloworkingReprositroy.destroy({where: {id}})
	}

	async getMetolloworking() {
		const metal = await this.metaloworkingReprositroy.findAll({include: [ {all: true}, {
			model: Detal, 
			include: ['documents', 'mat_za_obj', {
				model: Shipments, 
				include: ['product', 'buyer']
			}, {
				model: PodPodMaterial,
				as: 'mat_za_obj',
				include: ['material'],
			}, {
				model: TechProcess,
					include: [{
						model: Operation, 
						include: ['marks']
					}]
			}] 
			}
		]})

		for(let obj of metal) {
			if(!obj.detal || !obj.detal.techProcesses || !obj.detal.techProcesses.operations.length) continue;
			for(let i in obj.detal.techProcesses.operations) {
				for(let j in obj.detal.techProcesses.operations) {
					if(obj.detal.techProcesses.operations[i].id < obj.detal.techProcesses.operations[j].id) {
						const ggg = obj.detal.techProcesses.operations[i]
						obj.detal.techProcesses.operations[i] = obj.detal.techProcesses.operations[j]
						obj.detal.techProcesses.operations[j] = ggg
					}
				}
			}
		}
		return metal
	}

	async getOneMetaloworkingById(id: number) {
		return await this.metaloworkingReprositroy.findByPk(id, {include: [{all: true}, 
			{
				model: Detal, 
				include: ['documents', 'mat_za_obj', {
					model: Shipments, 
					include: ['product']
				}, {
					model: TechProcess,
						include: [{
							model: Operation, 
							include: ['marks']
						}]
				}] 
			}
		]})
	}

	async getMetalloworkingByTypeOperation(op_id: number) {
		const metaloworkings = await this.getMetolloworking()
		const arr = []
		for(let metal of metaloworkings) {
			try {
				if(!metal.detal || !metal.detal.techProcesses) continue
				for(let operation of metal.detal.techProcesses.operations) {
					if(operation.name == op_id) {
						const operation_new = {operation, metal}
						arr.push(operation_new)
					}
				}
			} catch (e) {console.error(e)}
		}	

		return arr
	}
}