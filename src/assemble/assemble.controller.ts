import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssembleService } from './assemble.service';
import { CreateAssembleDto } from './dto/create-assemble.dto';
import { UpdateAssembleDto } from './dto/update-assemble.dto';

@ApiTags('Сборка')
@Controller('assemble')
export class AssembleController {
	constructor(private assembleService: AssembleService) {}

	@ApiOperation({summary: 'Создаем Сборку'})
	@Post('/')
	createAssemble(@Body() dto: CreateAssembleDto) {
		return this.assembleService.createAssemble(dto)
	}

	@ApiOperation({summary: 'Обнвляем Сборку'})
	@Put('/')
	updateAssemble(@Body() dto: UpdateAssembleDto) {
		return this.assembleService.updateAssemble(dto)
	}

	@ApiOperation({summary: 'Получить все Сборки'})
	@Get('/allnocomducted/:isBan')
	getAllAssNoComing(@Param('isBan') isBan: boolean = false) {
			return this.assembleService.getAllAssemble(isBan, false)
	}

	@ApiOperation({summary: 'Получить все Сборки'})
	@Get('/all/:isBan')
	getAllAssemble(@Param('isBan') isBan: boolean = false) {
			return this.assembleService.getAllAssemble(isBan)
	}

	@ApiOperation({summary: 'Получить все Сборки'})
	@Get('/asstoplan/:type')
	getAllAssemblePlan(@Param('type') type: string) {
			return this.assembleService.getAllAssemblePlan(type);
	}

	@ApiOperation({summary: 'Получить Сборку'})
	@Get('/:id')
	getAssembleById(@Param('id') id: number) {
			return this.assembleService.getAssembleById(id)
	}

	@ApiOperation({summary: 'Удалить Сборку'})
	@Delete('/:id')
	deleteAssembly(@Param('id') id: number) {
			return this.assembleService.deleteAssembly(id)
	}

	@ApiOperation({summary: 'Вернуть Сборку из Архива'})
	@Put('/comback/:id')
	combackeAssembly(@Param('id') id: number) {
			return this.assembleService.combackeAssembly(id)
	}

	@ApiOperation({summary: 'Получаем все сборки по типам операций'})
	@Get('/typeoperation/:op_id')
	getAssembleByOperation(@Param('op_id') op_id: number) {
			return this.assembleService.getAssembleByOperation(op_id)
	}
}
 