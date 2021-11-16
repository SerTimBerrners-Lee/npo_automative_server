import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuyerService } from 'src/buyer/buyer.service';
import { CbedService } from 'src/cbed/cbed.service';
import { DetalService } from 'src/detal/detal.service';
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
		private setingsService: SettingsService) {}

	async createShipments(dto: UpCreateShipmentsDto) {
		const dm = new DateMethods()
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
		
		return await this.upCreateShipments(dto, shipment);

	}

	async updateShipments(dto: UpCreateShipmentsDto) {
		const shipment = await this.shipmentsReprository.findByPk(dto.id);
		if(!shipment)
			throw new HttpException('Не удалось создать заказ', HttpStatus.BAD_REQUEST)

		return await this.upCreateShipments(dto, shipment)
	}

	private async upCreateShipments(dto: UpCreateShipmentsDto, shipment: Shipments) {
		shipment.date_order = dto.date_order
		shipment.date_shipments = dto.date_shipments
		shipment.kol = dto.kol
		shipment.day_when_shipments = dto.day_when_shipments
		shipment.bron = dto.bron
		shipment.base = dto.base
		shipment.to_sklad = dto.to_sklad
		if(dto.description != 'null')
			shipment.description = dto.description
			else shipment.description = ''

		shipment.list_cbed_detal = ''
		if(dto.list_cbed_detal && dto.list_cbed_detal != 'null' || dto.list_cbed_detal != '[]') {
			shipment.list_cbed_detal = dto.list_cbed_detal
			try {
				let list_izd = JSON.parse(dto.list_cbed_detal)
				for(let izd of list_izd) {
					if(izd.type == 'cbed') {
						let izdels = await this.cbedService.findById(izd.obj.id) 
						if(izdels) {
							izdels.shipments_kolvo = izdels.shipments_kolvo + Number(izd.kol)
							await izdels.save()
							shipment.$add('cbeds', izdels.id)
						}
					} else if(izd.type == 'detal') {
							let izdels = await this.detalService.findByIdDetal(izd.obj.id)
							if(izdels) {
								izdels.kolvo_shipments = izdels.kolvo_shipments + Number(izd.kol)
								await izdels.save()
								shipment.$add('detals', izdels.id)
							}
					}
				}
			} catch(e) {
				console.error(e)
			}
		}

		if(dto.buyer) {
			const buyer = await this.buyerService.getByuerById(dto.buyer)
			if(buyer) {
				shipment.buyerId = buyer.id
				await shipment.save()
			}
		}
		if(dto.product) {
			const product = await this.productService.getById(dto.product.id)
			if(product) {
				shipment.productId = product.id
				await shipment.save()
			}
		}

		await shipment.save()
		return shipment
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
