import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
import { UpdateMetaloworkingDto } from './dto/update-metalloworking.dto';
import { MetaloworkingService } from './metaloworking.service';

@ApiTags('Металообработка')
@Controller('metaloworking')
export class MetaloworkingController {
	constructor(private metaloworkingService: MetaloworkingService) {}

	@ApiOperation({summary: 'Создаем Металообработку'})
	@Post('/')
	createMetaloworking(@Body() dto: CreateMetaloworkingDto) {
			return this.metaloworkingService.createMetaloworking(dto)
	}

	@ApiOperation({summary: 'Создаем заявку'})
	@Post('/shapebid/')
	createShapeBid(@Body() dto: Array<{name: string, id: number, kolvo: number}>) {
			return this.metaloworkingService.createShapeBid(dto)
	}

	@ApiOperation({summary: 'Обновляем Металообработку'})
	@Put('/')
	updateMetaloworking(@Body() dto: UpdateMetaloworkingDto) {
			return this.metaloworkingService.updateMetaloworking(dto)
	}

	@ApiOperation({summary: 'Получить по ID из металообработки'})
	@Get('/:id')
	getOneMetaloworkingById(@Param('id') id: number) {
			return this.metaloworkingService.getOneMetaloworkingById(id)
	}
    
	@ApiOperation({summary: 'Получить всю металлообработку'})
	@Get('/all/:isBan')
	getMetolloworking(@Param('isBan') isBan: boolean = false) {
			return this.metaloworkingService.getMetolloworking(isBan)
	}

	@ApiOperation({summary: 'Удалить Металлообработку'})
	@Delete('/:id')
	deleteMetolloworking(@Param('id') id: number) {
			return this.metaloworkingService.deleteMetolloworking(id)
	}

	@ApiOperation({summary: 'Вернуть Металлообработку из архива'})
	@Put('/comback/:id')
	combackeMetolloworking(@Param('id') id: number) {
			return this.metaloworkingService.combackMetolloworking(id)
	}

	@ApiOperation({summary: 'Получить по ID из металообработки'})
	@Get('/typeoperation/:op_id')
	getMetalloworkingByTypeOperation(@Param('op_id') op_id: number) {
			return this.metaloworkingService.getMetalloworkingByTypeOperation(op_id)
	}
}
   