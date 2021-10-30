import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
   