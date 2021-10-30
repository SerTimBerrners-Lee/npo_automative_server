import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssembleService } from './assemble.service';
import { CreateAssembleDto } from './dto/create-assemble.dto';

@ApiTags('Сборка')
@Controller('assemble')
export class AssembleController {
	constructor(private assembleService: AssembleService) {}

	@ApiOperation({summary: 'Создаем Сборочную единицу'})
	@Post('/')
	createAssemble(@Body() dto: CreateAssembleDto) {
		return this.assembleService.createAssemble(dto)
	}

	@ApiOperation({summary: 'Получить все сборочные единицы'})
	@Get('/')
	getAllAssemble() {
			return this.assembleService.getAllAssemble()
	}

	@ApiOperation({summary: 'Получить все сборочные единицы'})
	@Get('/:id')
	getAssembleById(@Param('id') id: number) {
			return this.assembleService.getAssembleById(id)
	}
}
 