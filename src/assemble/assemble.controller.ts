import { Body, Controller, Post } from '@nestjs/common';
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
}
 