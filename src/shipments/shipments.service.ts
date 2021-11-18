import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuyerService } from 'src/buyer/buyer.service';
import { CbedService } from 'src/cbed/cbed.service';
import { DetalService } from 'src/detal/detal.service';
import { DocumentsService } from 'src/documents/documents.service';
import { DateMethods } from 'src/files/date.methods';
import { ProductService } from 'src/product/product.service';
import { SettingsService } from 'src/settings/settings.service';
import { UpCreateShipmentsDto } from './dto/up-create-shipments.dto';
import { Shipments } from './shipments.model';

@Injectable()
export class ShipmentsService {
	constructor(@InjectModel(Shipments) private shipmentsReprository: typeof Shipments,
		private buyerService: BuyerService, 
		private productService: ProductService,
		private cbedService: CbedService,
		private detalService: DetalService,
		private setingsService: SettingsService,
		private documentsService: DocumentsService) {}

	async createShipments(dto: UpCreateShipmentsDto, files: any) {
		const dm = new DateMethods()
		if(!dto.data) 
			throw new HttpException('Пустое тело запроса', HttpStatus.NO_CONTENT)
		const endShipments = await this.shipmentsReprository.findOne(
			{
				order: [
					['id', 'DESC']
				],
				limit: 1
			})
		let endYears = dm.date().split('.')[dm.date().split('.').length - 1].slice(2);
		const numberEndShipments = endShipments && endShipments.id ?  
			`№ ${endYears}-${endShipments.id + 1} от ${dm.date()}` : `№ ${endYears}-1 от ${dm.date()}`

		const shipment = await this.shipmentsReprository.create({number_order: numberEndShipments});
		if(!shipment)
			throw new HttpException('Не удалось создать заказ', HttpStatus.BAD_REQUEST)

		const data = JSON.parse(dto.data)
		if(!data)
			throw new HttpException('Пустой запрос', HttpStatus.NO_CONTENT)
		data.docs = dto.docs
		return await this.upCreateShipments(data, shipment, files);

	}

	async updateShipments(dto: UpCreateShipmentsDto, files: any) {
		const data = JSON.parse(dto.data)
		if(!data)
			throw new HttpException('Пустой запрос', HttpStatus.NO_CONTENT)
		const shipment = await this.shipmentsReprository.findByPk(data.id, {include: {all: true}});
		if(!shipment)
			throw new HttpException('Не удалось найти заказ', HttpStatus.BAD_REQUEST)
		data.docs = dto.docs
		return await this.upCreateShipments(data, shipment, files)
	}

	private async upCreateShipments(data: any, shipment: Shipments, files: any) {
		shipment.date_order = data.date_order
		shipment.date_shipments = data.date_shipments
		shipment.kol = data.kol
		shipment.bron = data.bron
		shipment.base = data.base
		shipment.to_sklad = data.to_sklad
		if(data.description != 'null')
			shipment.description = data.description
			else shipment.description = ''
		
		console.log(data)
		console.log(files)

		if(data.list_cbed_detal && data.list_cbed_detal != 'null' || data.list_cbed_detal != '[]') {
			try {
				let list_izd = JSON.parse(data.list_cbed_detal)
				for(let izd of list_izd) {
					if(data.id && shipment.list_cbed_detal) {
						const parsCurList = JSON.parse(shipment.list_cbed_detal)
						let check = true
						for(let upl_izd of parsCurList) {
							if(upl_izd.type == izd.type && upl_izd.obj.id == izd.obj.id) {
								if(Number(izd.kol) > Number(upl_izd.kol)) izd.kol = Number(izd.kol) - Number(upl_izd.kol)
								if(Number(izd.kol) < Number(upl_izd.kol)) izd.kol = Number(izd.kol) - Number(upl_izd.kol)
								else check = false
								// Если элемент был а сейчас его нет удаляем элемент 
							}
						}
						if(!check) continue
						console.log(izd, check)
					}
					await this.incrementShipmentsKolvo(izd, shipment, 'increment')
				}
				// Перед тем как присвоить - проверяем удалены ли какие -то элементы 
				if(shipment.list_cbed_detal) {
					const parsCurList = JSON.parse(shipment.list_cbed_detal)
					for(let izd of parsCurList) {
						let check = false
						for(let dat_item of list_izd) {
							if(dat_item.type == izd.type && dat_item.obj.id == izd.obj.id) check = true
						}
						if(!check) await this.incrementShipmentsKolvo(izd, shipment, 'decriment')
						check = false
					}
				}
				shipment.list_cbed_detal = data.list_cbed_detal
			} catch(e) {
				console.error(e)
			}
		} else shipment.list_cbed_detal = ''

		if(data.buyer && Number(data.buyer) && !data.to_sklad) {
			const buyer = await this.buyerService.getByuerById(data.buyer)
			if(buyer) {
				shipment.buyerId = buyer.id
				await shipment.save()
			}
		}
		if(data.to_sklad) {
			if(shipment.buyerId) 
				shipment.buyerId = null
			await shipment.save()
		}
		if(data.product) {
			const product = await this.productService.getById(data.product.id)
			if(product) {
				product.shipments_kolvo = data.kol
				shipment.productId = product.id
				await product.save()
				await shipment.save()
			}
		}

		if(data.docs) {
			let docs: any = Object.values(JSON.parse(data.docs))
			let i = 0
			for(let document of files.document) {
				let res = await this.documentsService.saveDocument(
					document, 
					'p', 
					docs[i].type,
					docs[i].version,
					docs[i].description,
					docs[i].name
				)
				if(res && res.id) {
					const docId = await this.documentsService.getFileById(res.id)
					if(docId) await shipment.$add('documents', docId.id)
				}
				i++
			}
	}

		await shipment.save()
		return shipment
	}

	async deleteShipmentsById(id:number) {
		const shipments = await this.shipmentsReprository.findByPk(id)
		if(!shipments) 
			throw new HttpException('Не удалось найти задачу', HttpStatus.NOT_FOUND)

		if(shipments.list_cbed_detal) {
			try {
				const pars = JSON.parse(shipments.list_cbed_detal)
				if(pars) {
					for(let izd of pars) {
						this.incrementShipmentsKolvo(izd, shipments, 'decriment')
					}
				}
			} catch(e) {console.error(e)}
		}
		if(shipments.productId) shipments.productId = null
		await shipments.save()
		const result = await this.shipmentsReprository.destroy({where: {id: shipments.id}})

		return result
	}

	private async incrementShipmentsKolvo(izd: any, shipment: Shipments, action: string) {
		if(izd.type == 'cbed') {
			let izdels = await this.cbedService.findById(izd.obj.id) 
			if(izdels) {
				if(action == 'increment') {
					izdels.shipments_kolvo = izdels.shipments_kolvo + Number(izd.kol)
					shipment.$add('cbeds', izdels.id)
				} else {
					izdels.shipments_kolvo = izdels.shipments_kolvo - Number(izd.kol)
					shipment.$remove('cbeds', izdels.id)
				}
				await izdels.save()
			}
		} else if(izd.type == 'detal') {
				let izdels = await this.detalService.findByIdDetal(izd.obj.id)
				if(izdels) {
					if(action == 'increment') {
						izdels.kolvo_shipments = izdels.kolvo_shipments + Number(izd.kol)
						shipment.$add('detals', izdels.id)
					} else {
						izdels.kolvo_shipments = izdels.kolvo_shipments - Number(izd.kol)
						shipment.$remove('detals', izdels.id)
					}
					await izdels.save()
				}
		}
	}

	async getAllShipments() {
		const shipments = await this.shipmentsReprository.findAll({include: {all: true}})
		return shipments
	}

	async getAllShipmentsSclad(to_sclad: boolean) {
		return await this.shipmentsReprository.findAll({where: {to_sklad: to_sclad}, include: {all: true}})
	}

	async changeShipmentToSclad(id: number) {
		const shipments = await this.shipmentsReprository.findByPk(id);
		if(shipments) {
			shipments.to_sklad = !shipments.to_sklad
			await shipments.save()
			return shipments
		}
	}

	async getById(id: number) {
		return await this.shipmentsReprository.findByPk(id, {include: {all: true}})
	}

	async getAllShipmentsAssemble() {
		const shipments = await this.shipmentsReprository.findAll({include: {all: true}})
		const assemble: any = []
		for(let sh of shipments)
			assemble.push(sh)
		return assemble
	}

	async getAllShipmentsMetaloworking() {
		const shipments = await this.shipmentsReprository.findAll({include: {all: true}})
		const metaloworking: any = []
		for(let sh of shipments) 
			metaloworking.push(sh)
		return metaloworking
	}

	async getAllShipmentsById(id: number) {
		return await this.shipmentsReprository.findByPk(id, {include: {all: true}})
	}

}
