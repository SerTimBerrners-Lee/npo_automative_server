import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cbed } from 'src/cbed/cbed.model';
import { CbedService } from 'src/cbed/cbed.service';
import { DetalService } from 'src/detal/detal.service';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { MetaloworkingService } from 'src/metaloworking/metaloworking.service';
import { ProductService } from 'src/product/product.service';
import { SettingsService } from 'src/settings/settings.service';
import { Shipments } from 'src/shipments/shipments.model';
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
			.create({
				date_order: dto.date_order,
				description: dto.description
			})
		if(!assemble)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY)
		
		if(!dto.number_order) 
			assemble.number_order = String(assemble.id)
		if(!dto.date_order) assemble.date_order = new Date().toLocaleString('ru-RU').split(',')[0]
		else assemble.number_order = dto.number_order

		if(dto.cbed_id) { 
			const cbed = await this.cbedService.findById(dto.cbed_id)
			if(cbed) {
				await this.shipmentsMaterialsForIzd(cbed, dto.my_kolvo)
				assemble.cbed_id = cbed.id
				if(cbed.techProcesses.id)
					assemble.tp_id = cbed.techProcesses.id
				assemble.kolvo_shipments = dto.my_kolvo
				cbed.assemble_kolvo = cbed.assemble_kolvo + dto.my_kolvo
				await cbed.save()
				if(dto.my_kolvo > dto.shipments_kolvo) {
					let differenc = Number(dto.my_kolvo) - Number(dto.shipments_kolvo)
					if(cbed.listDetal)
						await this.parseDetalJson(cbed.listDetal, differenc)
					if(cbed.listCbed)
						await this.parseCbedJson(cbed.listCbed, differenc)
				}
			}
		}
		
		await assemble.save()
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
			console.error(e)
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
			console.error(e)
		}
	}

	private async parseMaterialJson(list_json_mat: string, kolvo_all: any = 1) {
		try {
			const pars_mat = JSON.parse(list_json_mat)
			if(pars_mat.length) {
				for(let material of pars_mat) {
					let mat_check = await this.settingsService.getOnePPT(material.mat.id)
					if(mat_check) {
						try {
							const pars_ez = JSON.parse(mat_check.ez_kolvo)
							if(material.ez) {
								if(material.ez == 1) pars_ez.c1_kolvo.shipments_kolvo = Number(pars_ez.c1_kolvo.shipments_kolvo)  + (Number(material.kol) * kolvo_all)
								if(material.ez == 2) pars_ez.c2_kolvo.shipments_kolvo = Number(pars_ez.c2_kolvo.shipments_kolvo)  + (Number(material.kol) * kolvo_all)
								if(material.ez == 3) pars_ez.c3_kolvo.shipments_kolvo = Number(pars_ez.c3_kolvo.shipments_kolvo)  + (Number(material.kol) * kolvo_all)
								if(material.ez == 4) pars_ez.c4_kolvo.shipments_kolvo = Number(pars_ez.c4_kolvo.shipments_kolvo)  + (Number(material.kol) * kolvo_all)
								if(material.ez == 5) pars_ez.c5_kolvo.shipments_kolvo = Number(pars_ez.c5_kolvo.shipments_kolvo)  + (Number(material.kol) * kolvo_all)
							}
							mat_check.ez_kolvo = JSON.stringify(pars_ez)
						} catch(e) {console.error(e)}
						
						mat_check.shipments_kolvo = mat_check.shipments_kolvo + (Number(material.kol) * kolvo_all)
						await mat_check.save()
					}
				}
			} 
		} catch(e) {
			console.error(e)
		}
	}

	async getAllAssemble() {
		const assembly = await this.assembleReprository.findAll({include: [ {all: true}, {
			model: Cbed, 
			include: ['documents', {
				model: Shipments, 
				include: ['product']
			}]
		}, {
			model: TechProcess,
			include: [{
				model: Operation, 
				include: ['marks']
			}]
		}]})

		for(let obj of assembly) {
			if(!obj.tech_process || !obj.tech_process.operations.length) continue
			for(let i in obj.tech_process.operations) {
				for(let j in obj.tech_process.operations) {
					if(obj.tech_process.operations[i].id < obj.tech_process.operations[j].id) {
						const ggg = obj.tech_process.operations[i]
						obj.tech_process.operations[i] = obj.tech_process.operations[j]
						obj.tech_process.operations[j] = ggg
					}
				}
			}
		}

		return assembly
	}

	async getAssembleById(id:number) {
		return await this.assembleReprository.findByPk(id, {include: {all: true}})
	}

	async getAssembleByOperation(op_id: number) {
		const assembles = await this.getAllAssemble()
		const arr = []
		for(let ass of assembles) {
			try {
				for(let operation of ass.tech_process.operations) {
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
 