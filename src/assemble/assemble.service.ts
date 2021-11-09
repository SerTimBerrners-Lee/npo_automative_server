import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cbed } from 'src/cbed/cbed.model';
import { CbedService } from 'src/cbed/cbed.service';
import { DetalService } from 'src/detal/detal.service';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { ProductService } from 'src/product/product.service';
import { SettingsService } from 'src/settings/settings.service';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { Assemble } from './assemble.model';
import { CreateAssembleDto } from './dto/create-assemble.dto';

@Injectable()
export class AssembleService {
	constructor(@InjectModel(Assemble) private assembleReprository: typeof Assemble,
		private shipmentService: ShipmentsService,
		private cbedService: CbedService,
		private settingsService: SettingsService, 
		private detalService: DetalService, 
		private metaloworkingService: MetaloworkingService, 
		private productService: ProductService) {} 


	async createAssemble(dto: CreateAssembleDto) {
		const assemble = await this.assembleReprository
			.create({...dto})
		if(!assemble)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY)
	
		if(dto.shipments_id) {
			const shipment = await this.shipmentService.getById(dto.shipments_id)
			if(shipment) {
				assemble.shipments_id = shipment.id
				// +  Product
				if(shipment.productId) {
					const product = await this.productService.getById(shipment.productId)
					if(product) {
						assemble.product_id = product.id
						await assemble.save()
					}
				}
			}
		}

		if(dto.cbed_id) { 
			const cbed = await this.cbedService.findById(dto.cbed_id)
			if(cbed) {
				if(cbed.techProcesses) {
					const tp = await this.detalService.getTechProcessById(cbed.techProcesses.id)
					if(tp) {
						assemble.tp_id = tp.id
						if(tp.operations && tp.operations.length)
							assemble.operation_id = tp.operations[0].id
						await assemble.save()
					}
				}
				await this.shipmentsMaterialsForIzd(cbed, dto.kolvo_all)
				console.log(dto)
				assemble.cbed_id = cbed.id
				cbed.assemble_kolvo = cbed.assemble_kolvo + dto.kolvo_all
				await cbed.save()
				if(dto.kolvo_all > dto.kolvo_order_byer) {
					let differenc = Number(dto.kolvo_all) - Number(dto.kolvo_order_byer)
					if(cbed.listDetal)
						await this.parseDetalJson(cbed.listDetal, differenc)
					if(cbed.listCbed)
						await this.parseCbedJson(cbed.listCbed, differenc)
				}
			}
		}
		
		return assemble
	}

	private async shipmentsMaterialsForIzd(izd: Cbed, kolvo_all: any = 1) {
		if(izd.materialList) 
			await this.parseMaterialJson(izd.materialList, kolvo_all)
		if(izd.listPokDet) 
			await this.parseMaterialJson(izd.listPokDet, kolvo_all)
	}

	private async parseDetalJson(list_json_detal: string, kolvo_all: any = 1) {
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
			console.log(e)
		}
	}

	private async parseCbedJson(list_json_cbed: string, kolvo_all: any = 1) {
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
			console.log(e)
		}
	}

	private async parseMaterialJson(list_json_mat: string, kolvo_all: any = 1) {
		try {
			const pars_mat = JSON.parse(list_json_mat)
			if(pars_mat.length) {
				for(let material of pars_mat) {
					let mat_check = await this.settingsService.getOnePPT(material.mat.id)
					if(mat_check) {
						mat_check.shipments_kolvo = mat_check.shipments_kolvo + (Number(material.kol) * kolvo_all)
						await mat_check.save()
					}
				}
			}
		} catch(e) {
			console.log(e)
		}
	}

	async getAllAssemble() {
		return await this.assembleReprository.findAll({include: {all: true}})
	}

	async getAssembleById(id:number) {
		return await this.assembleReprository.findByPk(id, {include: {all: true}})
	}

	async getAssembleByOperation(op_id: number) {
		const assembles = await this.assembleReprository.findAll({ include: {all: true}})
		let arr: Array<Assemble> = []
		for(let ass of assembles) {
			if(ass.operation && ass.operation.name == op_id)
				arr.push(ass)
		}

		return arr
	}
}
 