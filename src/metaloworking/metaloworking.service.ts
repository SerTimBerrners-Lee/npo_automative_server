import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Detal } from 'src/detal/detal.model';
import { DetalService } from 'src/detal/detal.service';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { StatusMetaloworking, statusShipment } from 'src/files/enums';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { SettingsService } from 'src/settings/settings.service';
import { Shipments } from 'src/shipments/shipments.model';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
import { UpdateMetaloworkingDto } from './dto/update-metalloworking.dto';
import { Metaloworking } from './metaloworking.model';

@Injectable()
export class MetaloworkingService {
	constructor(
		@InjectModel(Metaloworking) private metaloworkingReprositroy: typeof Metaloworking, 
		@Inject(forwardRef(()=> ShipmentsService))
		private shipmentsService: ShipmentsService, 
		private detalService: DetalService,
		private settingsService: SettingsService) {}

	async createMetaloworking(dto: CreateMetaloworkingDto) {
		const metaloworking = await this.metaloworkingReprositroy
			.create({
				date_order: dto.date_order,
				description: dto.description 
			})
		if(!metaloworking)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY)

		metaloworking.number_order = String(metaloworking.id) + dto.number_order.trim()
		if(!dto.date_order) metaloworking.date_order = new Date().toLocaleString('ru-RU').split(',')[0]

		await metaloworking.save()

		if(!dto.detal_id) return metaloworking
		const detal = await this.detalService.findByIdDetal(dto.detal_id)
		if(!detal) return metaloworking

		if(detal.shipments.length) 
			await this.shipmentsService.updateStatus(detal.shipments, statusShipment.performed)

		metaloworking.detal_id = detal.id
		metaloworking.kolvo_shipments = dto.my_kolvo
		detal.metalloworking_kolvo = detal.metalloworking_kolvo + dto.my_kolvo
		await metaloworking.save()

		return metaloworking
	}

	async updateMetaloworking(dto: UpdateMetaloworkingDto) {
		const metal = await this.metaloworkingReprositroy.findByPk(dto.metal_id)
		const detal = await this.detalService.findByIdDetal(dto.detal_id)
		if(!metal || !detal) 
			throw new HttpException('Не удалось найти Деталь или металлообработку', HttpStatus.BAD_REQUEST)

		let differece = dto.kolvo_shipments - metal.kolvo_shipments 
		if(differece < 0)  {
			detal.metalloworking_kolvo -= differece
		}
		else if(differece > 0) {
			detal.metalloworking_kolvo += differece
		}

		metal.description = dto.description
		metal.kolvo_shipments = dto.kolvo_shipments

		await metal.save()
		await detal.save()
		return metal
	}

	// Delete Metalloworking
	async deleteMetolloworking(id: number) {
		const metalloworking = await this.metaloworkingReprositroy.findByPk(id)
		if(!metalloworking) throw new HttpException('Не удалось удалить металообработки', HttpStatus.BAD_REQUEST)
		if(!metalloworking.ban) {
			metalloworking.ban = true
			metalloworking.status = StatusMetaloworking.ban
			await	metalloworking.save()
			return id
		}
		if(!metalloworking.detal) return await this.metaloworkingReprositroy.destroy({where: {id}})

		const detal = await this.detalService.findByIdDetal(metalloworking.detal.id)
		if(!detal) return await this.metaloworkingReprositroy.destroy({where: {id}})

		detal.metalloworking_kolvo = detal.metalloworking_kolvo - metalloworking.kolvo_shipments < 0 
			? 0 : detal.metalloworking_kolvo - metalloworking.kolvo_shipments
		await detal.save()
		
		return await this.metaloworkingReprositroy.destroy({where: {id}})
	}

	async combackMetolloworking(id: number) {
		const metalloworking = await this.metaloworkingReprositroy.findByPk(id)
		if(!metalloworking) throw new HttpException('Не удалось вернуть металообработки из архива', HttpStatus.BAD_REQUEST)

		metalloworking.ban = false
		metalloworking.status = StatusMetaloworking.performed
		await metalloworking.save()
		return id
	}

	async getMetolloworking(isBan: boolean = false) {
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
		], where: {ban: isBan}})

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