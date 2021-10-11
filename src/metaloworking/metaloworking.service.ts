import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DetalService } from 'src/detal/detal.service';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
import { Metaloworking } from './metaloworking.model';

@Injectable()
export class MetaloworkingService {
	constructor(@InjectModel(Metaloworking) private metaloworkingReprositroy: typeof Metaloworking, 
		private shipmentService: ShipmentsService,
		private detalService: DetalService) {}

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
			const detal = await this.detalService.findById(dto.detal_id)
			if(detal) 
				metaloworking.$add('detals', detal.id)
		}

		console.log(dto)
		
		return metaloworking

	}
}
