import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

	@ApiOperation({summary: 'Получить все заказы в зависимости на складе или нет'})
  @Get('/sclad/:to_sclad')
	getAllShipmentsSclad(@Param('to_sclad') to_sclad: boolean) {
		return this.shipmentsSettings.getAllShipmentsSclad(to_sclad);
	}

	@ApiOperation({summary: 'Получить все заказы в сборке'})
  @Get('/assemble')
	getAllShipmentsAssemble() {
		return this.shipmentsSettings.getAllShipmentsAssemble();
	}

	@ApiOperation({summary: 'Получить все детали'})
  @Get('/metaloworking')
	getAllShipmentsMetaloworking() {
		return this.shipmentsSettings.getAllShipmentsMetaloworking();
	}

	@ApiOperation({summary: 'Получить все заказы в сборке'})
  @Get('/:id')
	getAllShipmentsById(@Param('id') id: number) {
		return this.shipmentsSettings.getAllShipmentsById(id);
	}

	@ApiOperation({summary: 'Перемешаем заказ на склад или обратно'})
  @Put('/sclad/:id')
	changeShipmentToSclad(@Param('id') id: number) {
		return this.shipmentsSettings.changeShipmentToSclad(id)
	}
}
 