import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShCheckDto } from './dto/sh-check.dto';
import { UpCreateShipmentsDto } from './dto/up-create-shipments.dto';
import { ShComplitService } from './sh-complite.service';
import { ShipmentsService } from './shipments.service';


@ApiTags('Задачи на отгрузку') 
@Controller('shipments')
export class ShipmentsController {
	constructor(private shipmentsSettings: ShipmentsService,
		private shComplitSettings: ShComplitService) {}

	@ApiOperation({summary: 'Создание заказа'})
	@UseInterceptors(FileFieldsInterceptor([
			{name: 'document', maxCount: 40}
	]))
  @Post()
	createShipments(
		@Body() dto: UpCreateShipmentsDto, 
		@UploadedFiles() files: { document?: Express.Multer.File[]} ) {
		return this.shipmentsSettings.createShipments(dto, files);
	}

	@ApiOperation({summary: 'Отгрузка заказа'})
	@UseInterceptors(FileFieldsInterceptor([
			{name: 'document', maxCount: 40}
	]))
  @Post('/shcheck')
	shComplitCreate(
		@Body() dto: ShCheckDto, 
		@UploadedFiles() files: { document?: Express.Multer.File[]} ) {
		return this.shComplitSettings.create(dto, files);
	}

	@ApiOperation({summary: 'Получает все отметки отгрузки'})
  @Get('/shcheck')
	getAllShComplit() {
		return this.shComplitSettings.getAll();
	}

	@ApiOperation({summary: 'Обновлние заказа'})
	@UseInterceptors(FileFieldsInterceptor([
			{name: 'document', maxCount: 40}
	]))
  @Put()
	updateShipments(
		@Body() dto: UpCreateShipmentsDto, 
		@UploadedFiles() files: { document?: Express.Multer.File[]} ) {
		return this.shipmentsSettings.updateShipments(dto, files);
	}

	@ApiOperation({summary: 'Удаление Заказа'})
  @Delete(':id')
	deleteShipmentsById(@Param('id') id: number) {
		return this.shipmentsSettings.deleteShipmentsById(id);
	}

	@ApiOperation({summary: 'Получить все заказы'})
  @Get('/all/:light')
	getAllShipments(@Param('light') light: string = 'false') {
		return this.shipmentsSettings.getAllShipments(light);
	}

	@ApiOperation({summary: 'Получить изделия для заказа'})
  @Get('/one/izd/:id')
	getShipmentsIzd(@Param('id') id: number) {
		console.log('\n\n\n\n\ id', id)
		return this.shipmentsSettings.getShipmentsIzd(id);
	}

	@ApiOperation({summary: 'Получить все заказы'})
  @Get('/all/to/shipments/')
	getAllShipmentsTo() {
		return this.shipmentsSettings.getAllShipmentsTo();
	}

	@ApiOperation({summary: 'Получить все заказы в зависимости на складе или нет'})
  @Get('/sclad/:to_sclad')
	getAllShipmentsSclad(@Param('to_sclad') to_sclad: boolean) {
		return this.shipmentsSettings.getAllShipmentsSclad(to_sclad);
	}

	@ApiOperation({summary: 'Получить все заказы в сборке'})
  @Get('/assemble/:light')
	getAllShipmentsAssemble(@Param('light') light: string = 'false') {
		return this.shipmentsSettings.getAllShipmentsAssemble(light);
	}

	@ApiOperation({summary: 'Получить все детали'})
  @Get('/metaloworking/:light')
	getAllShipmentsMetaloworking(@Param('light') light: string = 'false') {
		return this.shipmentsSettings.getAllShipmentsMetaloworking(light);
	}

	@ApiOperation({summary: 'Получить все заказы в сборке'})
  @Get('/light/:id/:light')
	getAllShipmentsById(@Param('id') id: number, @Param('light') light: 'string') {
		return this.shipmentsSettings.getAllShipmentsById(id, light);
	}

	@ApiOperation({summary: 'Перемешаем заказ на склад или обратно'})
  @Put('/sclad/:id')
	changeShipmentToSclad(@Param('id') id: number) {
		return this.shipmentsSettings.changeShipmentToSclad(id)
	}

	@ApiOperation({summary: 'Получает все документы заказа'})
  @Get('/documents/:id')
	returnDoucments(@Param('id') id: number) {
		return this.shipmentsSettings.returnDoucments(id)
	}
}
 