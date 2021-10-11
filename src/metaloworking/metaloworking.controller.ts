import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMetaloworkingDto } from './dto/create-metaloworking.dto';
import { MetaloworkingService } from './metaloworking.service';

@ApiTags('Металообработка')
@Controller('metaloworking')
export class MetaloworkingController {
	constructor(private metaloworkingService: MetaloworkingService) {}

	@ApiOperation({summary: 'Создаем Сборочную единицу'})
	@Post('/')
	createMetaloworking(@Body() dto: CreateMetaloworkingDto) {
			return this.metaloworkingService.createMetaloworking(dto)
	}
}
 