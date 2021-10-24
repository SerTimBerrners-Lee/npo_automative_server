import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Detal } from 'src/detal/detal.model';
import { DetalService } from 'src/detal/detal.service';
import { SettingsService } from 'src/settings/settings.service';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
import { Metaloworking } from './metaloworking.model';

@Injectable()
export class MetaloworkingService {
	constructor(@InjectModel(Metaloworking) private metaloworkingReprositroy: typeof Metaloworking, 
		private shipmentService: ShipmentsService,
		private detalService: DetalService,
		private settingsService: SettingsService) {}

	async createMetaloworking(dto: CreateMetaloworkingDto) {
		const metaloworking = await this.metaloworkingReprositroy
			.create({...dto})
		if(!metaloworking)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY)
	
		if(dto.shipments_id) {
			const shipment = await this.shipmentService.getById(dto.shipments_id)
			if(shipment) 
				metaloworking.$add('shipments', shipment.id)
		}

		if(dto.detal_id) {
			const detal = await this.detalService.findByIdDetal(dto.detal_id)
			if(detal) {
				metaloworking.detal_id = detal.id
				await this.shipmentsMaterialsForDetal(detal, dto.kolvo_all)
			}
		}

		console.log(dto)
		return metaloworking

	}

	async shipmentsMaterialsForDetal(detal: Detal, kolvo_all: any) {
		console.log(detal)
		if(detal.mat_zag) {
			const mat_zag = await this.settingsService.getOnePPT(detal.mat_zag)
			if(mat_zag) {
				mat_zag.shipments_kolvo = mat_zag.shipments_kolvo + (1 * kolvo_all)
				await mat_zag.save()
			}
		}
		if(detal.mat_zag_zam) {
			const mat_zag_zam = await this.settingsService.getOnePPT(detal.mat_zag_zam)
			if(mat_zag_zam) {
				mat_zag_zam.shipments_kolvo = mat_zag_zam.shipments_kolvo + (1 * kolvo_all)
				await mat_zag_zam.save()
			}
		}

		if(detal.materialList) {
			try {
				const pars_mat = JSON.parse(detal.materialList)
				if(pars_mat.length) {
					for(let material of pars_mat) {
						let mat_check = await this.settingsService.getOnePPT(material.mat.id)
						if(mat_check) {
							mat_check.shipments_kolvo = mat_check.shipments_kolvo + (material.kol * kolvo_all)
							await mat_check.save()
						}
					}
				}
			} catch(e) {
				console.log(e)
			}
		}
	}

	async getOneMetaloworkingById(id: number) {
		return await this.metaloworkingReprositroy.findByPk(id, {include: {all: true}})
	}
}
