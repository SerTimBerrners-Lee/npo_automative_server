import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
		@Inject(forwardRef(() => ShipmentsService))
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
				assemble.cbed_id = cbed.id
				assemble.kolvo_shipments = dto.my_kolvo
				cbed.assemble_kolvo = cbed.assemble_kolvo + dto.my_kolvo
				await cbed.save()
				if(dto.my_kolvo > dto.shipments_kolvo) {
					let differenc = Number(dto.my_kolvo) - Number(dto.shipments_kolvo)
					await this.shipmentsMaterialsForIzd(cbed, differenc)
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

	async shipmentsMaterialsForIzd(izd: Cbed, kolvo_all: any = 1) {
		if(izd.materialList) 
			await this.parseMaterialJson(izd.materialList, kolvo_all)
		if(izd.listPokDet) 
			await this.parseMaterialJson(izd.listPokDet, kolvo_all)
	}

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

	async parseMaterialJson(list_json_mat: string, kolvo_all: any = 1) {
		try {
			const pars_mat = JSON.parse(list_json_mat)
			if(pars_mat.length) {
				for(let material of pars_mat) {
					let mat_check = await this.settingsService.getOnePPT(material.mat.id)
					if(mat_check) {
						try {
							const pars_ez = JSON.parse(mat_check.ez_kolvo)
							// Если инеремент мы должны оставить так как есть сейчас 
							// если отрицательный значит мы должны удалить 
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
		]})
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

	async deleteAssembly(id: number) {
		const ass = await this.assembleReprository.findByPk(id, {include: {all: true}})
		if(!ass) throw new HttpException('Не удалось удалить Сборку', HttpStatus.BAD_REQUEST)

		if(!ass.cbed) return await this.assembleReprository.destroy({where: {id}})

		const cbed = await this.cbedService.getOneCbedById(ass.cbed.id)
		if(!cbed) return await this.assembleReprository.destroy({where: {id}})
		cbed.assemble_kolvo = cbed.assemble_kolvo - ass.kolvo_shipments < 0 ? 0 : cbed.assemble_kolvo - ass.kolvo_shipments
		await cbed.save()
		
		return await this.assembleReprository.destroy({where: {id}})
	}

	async getAssembleById(id:number) {
		return await this.assembleReprository.findByPk(id, {include: [{all: true}, 
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
		]})
	}

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
 