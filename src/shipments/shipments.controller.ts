import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpCreateShipmentsDto } from './dto/up-create-shipments.dto';
import { ShipmentsService } from './shipments.service';


@ApiTags('Задачи на отгрузку') 
@Controller('shipments')
export class ShipmentsController {
	constructor(private shipmentsSettings: ShipmentsService) {}

	@ApiOperation({summary: 'Создание заказа'})
  @Post()
	createShipments(@Body() dto: UpCreateShipmentsDto) {
			return this.shipmentsSettings.createShipments(dto);
	}

	@ApiOperation({summary: 'Получить все заказы'})
  @Get()
	getAllShipments() {
			return this.shipmentsSettings.getAllShipments();
	}
}
 