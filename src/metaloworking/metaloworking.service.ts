import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Detal } from 'src/detal/detal.model';
import { DetalService } from 'src/detal/detal.service';
import { Operation } from 'src/detal/operation.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { StatusMetaloworking, statusShipment } from 'src/files/enums';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { Shipments } from 'src/shipments/shipments.model';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
import { UpdateMetaloworkingDto } from './dto/update-metalloworking.dto';
import { Metaloworking } from './metaloworking.model';
import { FilesService } from 'src/files/files.service';
import { DateMethods } from 'src/files/date.methods';
const xlsx = require('node-xlsx').default;
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MetaloworkingService {
	constructor(
		@InjectModel(Detal) private detalReprository: typeof Detal,
		@InjectModel(PodPodMaterial) private materialReprository: typeof PodPodMaterial,
		@InjectModel(Metaloworking) private metaloworkingReprositroy: typeof Metaloworking, 
		@Inject(forwardRef(()=> ShipmentsService))
		private shipmentsService: ShipmentsService, 
		private filesService: FilesService,
		private detalService: DetalService) {}

	async createMetaloworking(dto: CreateMetaloworkingDto) {
		const metaloworking = await this.metaloworkingReprositroy
			.create({
				date_order: dto.date_order,
				description: dto.description 
			});
	
		if (!metaloworking)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY);

		metaloworking.number_order = dto.number_order.trim() + "_" + String(metaloworking.id);
		if (!dto.date_order) metaloworking.date_order = new Date().toLocaleString('ru-RU').split(',')[0];

		await metaloworking.save();

		if (!dto.detal_id) return metaloworking;
		const detal = await this.detalService.findByIdDetal(dto.detal_id);
		if (!detal) return metaloworking;

		metaloworking.detal_id = detal.id;
		metaloworking.kolvo_shipments = dto.my_kolvo;
		detal.metalloworking_kolvo += dto.my_kolvo;
		await detal.save();
		await metaloworking.save();

		return metaloworking
	}

	async updateMetaloworking(dto: UpdateMetaloworkingDto) {
		const metal = await this.metaloworkingReprositroy.findByPk(dto.metal_id);
		const detal = await this.detalService.findByIdDetal(dto.detal_id, 'true');
		if (!metal || !detal)  
			throw new HttpException('Не удалось найти Деталь или металлообработку', HttpStatus.BAD_REQUEST);

		const differece = dto.kolvo_shipments - metal.kolvo_shipments ;
		if (differece < 0)  {
			if (detal.metalloworking_kolvo - differece < 0)
				detal.metalloworking_kolvo = 0;
			else detal.metalloworking_kolvo -= differece;
		}
		if (differece > 0) 
			detal.metalloworking_kolvo += differece;
		

		metal.description = dto.description;
		metal.kolvo_shipments = dto.kolvo_shipments;

		await metal.save();
		await detal.save();
		return metal;
	}

	// Delete Metalloworking
	async deleteMetolloworking(id: number) {
		const metalloworking = await this.metaloworkingReprositroy.findByPk(id, {include: {all: true}})
		if (!metalloworking) throw new HttpException('Не удалось получить металообработки', HttpStatus.BAD_REQUEST);
		if (!metalloworking.detal) throw new HttpException('Нет детали у металообработки', HttpStatus.BAD_REQUEST);

		const detal = await this.detalService.findByIdDetal(metalloworking.detal.id, 'true')
		if (!detal) throw new HttpException('Не удалось получить деталь у металлообработки', HttpStatus.BAD_REQUEST);

		metalloworking.ban = !metalloworking.ban;
		if (!metalloworking.ban) {
			metalloworking.status = StatusMetaloworking.ban;

			detal.metalloworking_kolvo = detal.metalloworking_kolvo - metalloworking.kolvo_shipments < 0 
			? 0 : detal.metalloworking_kolvo - metalloworking.kolvo_shipments;
			await detal.$remove('metaloworking', metalloworking.id);
		}
		else {
			metalloworking.status = StatusMetaloworking.performed; // Сделать проверку на просрочку!
			detal.metalloworking_kolvo += metalloworking.kolvo_shipments;
			await detal.$add('metaloworking', metalloworking.id);
		}

		await detal.save();
		await metalloworking.save();
		
		return metalloworking;
	}

	async combackMetolloworking(id: number) {
		const metalloworking = await this.metaloworkingReprositroy.findByPk(id);
		if (!metalloworking) throw new HttpException('Не удалось вернуть металообработки из архива', HttpStatus.BAD_REQUEST);

		metalloworking.ban = false;
		metalloworking.status = StatusMetaloworking.performed;
		await metalloworking.save();
		return id;
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

		for (const obj of metal) {
			if (!obj.detal || !obj.detal.techProcesses || !obj.detal.techProcesses.operations.length) continue;
			for (let i in obj.detal.techProcesses.operations) {
				for (let j in obj.detal.techProcesses.operations) {
					if (obj.detal.techProcesses.operations[i].id < obj.detal.techProcesses.operations[j].id) {
						const ggg = obj.detal.techProcesses.operations[i];
						obj.detal.techProcesses.operations[i] = obj.detal.techProcesses.operations[j];
						obj.detal.techProcesses.operations[j] = ggg;
					}
				}
			}
		}
		return metal;
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
		const metaloworkings = await this.getMetolloworking();
		const arr = [];
		const dt = new DateMethods();

		for (const metal of metaloworkings) {
			try {
				if (!metal.detal || !metal.detal.techProcesses) continue;
				for (const operation of metal.detal.techProcesses.operations) {
					if (operation.name == op_id) {
						const operation_new = { operation, metal };
						let kol = 0;
						let date_build_today = false;
						for (const mark of operation.marks) {
							kol += mark.kol;
							if (dt.comparison(undefined, mark.date_build)) date_build_today = true;
						}
						if (metal.kolvo_shipments <= kol && !date_build_today) continue;
						arr.push(operation_new);
					}
				}
			} catch (e) {console.error(e)}
		}

		return arr;
	}

	async getResultWorking() {
		const metaloworkings = await this.getMetolloworking();
		const arr = [];

		for (const metal of metaloworkings) {
			try {
				if (!metal.detal || !metal.detal.techProcesses) continue;
				for (const operation of metal.detal.techProcesses.operations) {
					let operation_new = { operation, metal, mark: {} };
					for (const mark of operation.marks) {
						if (mark.kol) {
							operation_new.mark = mark;	
							arr.push(operation_new);
						}
					}
				}
			} catch (e) {console.error(e)}
		}

		return arr;
	}

	/**
	 * Create Shape Bid
	*/

	async createShapeBid(dto: Array<{name: string, id: number, kolvo: number}>) {
		
		if (!dto || !dto.length) 
			throw new HttpException('Переданный массив пустой', HttpStatus.BAD_GATEWAY);
		
		const detals: Array<Object> = [];
		const {archive, nameZip} = await this.filesService.createZipper();
		let sheetsData: any = [
			['Наименование', 'Номер чертежа', 'Имя чертежа', 'Материал', 'Толщина', 'Маршрут', 'Количество']
		];
		const sheetOptions = {'!cols': [
			{wch: 30}, {wch: 10}, {wch: 40}, {wch: 30}
		]};

		for (const item of dto) {
			if (!item.id) continue;

			const detal = await this.detalReprository.findByPk(item.id, {
				include: ['documents'],
				attributes: ['mat_zag', 'mat_zag_zam', 'thickness', 'DxL']
			});
			if (!detal)
				throw new HttpException('Переданный массив пустой', HttpStatus.BAD_GATEWAY);

			const material = await this.materialReprository.findByPk(detal.mat_zag, {attributes: ['name']});
			
			let documents = detal.documents.filter(doc => (!doc.banned && doc.type.toLocaleUpperCase() == 'DXF'));
			if (!documents.length)
				documents = detal.documents.filter(doc => (!doc.banned && doc.type.toLocaleUpperCase() == 'ЧЖ'));

			documents = documents.sort((a, b) => b.version - a.version); // Сортируем по версии.
			if (!documents.length) continue;
	
			const file = path.resolve(__dirname, '..', `static/${documents[0].path}`);
			
			if (!fs.existsSync(file)) continue; // Проверяем что файл существует.
			await archive.append(fs.createReadStream(file), { name: documents[0].name });
			
			sheetsData.push([
				item.name, documents[0].version, documents[0].name, 
				material?.name || '-',
				detal.thickness, '', item.kolvo 
			]);
			detals.push({detal, material});
		}

		const buffer = await xlsx.build([{name: 'mySheetName', data: sheetsData}], {sheetOptions});

		await archive.append(buffer, {name: 'Заявка от ' + new DateMethods().date() + '.xlsx'})
		await archive.finalize();

		return { pathZip: nameZip };
	}
}