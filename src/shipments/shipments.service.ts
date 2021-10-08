import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuyerService } from 'src/buyer/buyer.service';
import { DateMethods } from 'src/files/date.methods';
import { ProductService } from 'src/product/product.service';
import { UpCreateShipmentsDto } from './dto/up-create-shipments.dto';
import { Shipments } from './shipments.model';

@Injectable()
export class ShipmentsService {
	constructor(@InjectModel(Shipments) private shipmentsReprository: typeof Shipments,
		private buyerService: BuyerService, 
		private productService: ProductService) {}

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
		shipment.kolvo = dto.kolvo
		shipment.day_when_shipments = dto.day_when_shipments
		shipment.bron = dto.bron
		shipment.base = dto.base
		shipment.to_sklad = dto.to_sklad
		shipment.description = dto.description
		shipment.list_cbed_detal = dto.list_cbed_detal

		console.log(dto)

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
}
