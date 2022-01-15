import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
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
   