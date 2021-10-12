import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CbedService } from 'src/cbed/cbed.service';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { Assemble } from './assemble.model';
import { CreateAssembleDto } from './dto/create-assemble.dto';

@Injectable()
export class AssembleService {
	constructor(@InjectModel(Assemble) private assembleReprository: typeof Assemble,
		private shipmentService: ShipmentsService,
		private cbedReprository: CbedService) {} 


	async createAssemble(dto: CreateAssembleDto) {
		const assemble = await this.assembleReprository
			.create({...dto})
		if(!assemble)
			throw new HttpException('Не удалось отправить в производство', HttpStatus.BAD_GATEWAY)
	
		if(dto.shipments_id) {
			const shipment = await this.shipmentService.getById(dto.shipments_id)
			if(shipment) 
				assemble.$add('shipments', shipment.id)
		}

		console.log(dto)

		if(dto.cbed_id) {
			const cbed = await this.cbedReprository.findById(dto.cbed_id)
			if(cbed) 
				assemble.cbed_id = cbed.id
		}
		
		return assemble
	}

	async getAllAssemble() {
		return await this.assembleReprository.findAll({include: {all: true}})
	}

	async getAssembleById(id:number) {
		return await this.assembleReprository.findByPk(id, {include: {all: true}})
	}
}
 