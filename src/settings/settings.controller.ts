import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEdizmDto } from './dto/create-edizm.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { CreateTypeEdizmDto } from './dto/create-type-edizm.dto';
import { UpdateEdizmDto } from './dto/update-edizm.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { SettingsService } from './settings.service';

@ApiTags('Настройки ПО')
@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @ApiOperation({summary: 'Создание типа ЕИ'})
    @Post('/typeedizm')
    createTypeEdizm(@Body() dto: CreateTypeEdizmDto) {
        return this.settingsService.createTypeEdizm(dto)
    }

    @ApiOperation({summary: 'Создание ЕИ'})
    @Post('/edizm')
    crateEdizm(@Body() dto: CreateEdizmDto) {
        return this.settingsService.createEdizm(dto)
    }

    @ApiOperation({summary: 'Получить все ЕИ'})
    @Get('/edizm')
    getAllEdizm() {
        return this.settingsService.getAllEdizm()
    }

    @ApiOperation({summary: 'Получить все типы ЕИ'})
    @Get('/typeedizm')
    getAllTypeEdizm() {
        return this.settingsService.getAllTypeEdizm()
    }

    @ApiOperation({summary: 'Удаление ЕИ по ID'})
    @Delete('/edizm/:id')
    deleteEdizmById(@Param('id') id: number) {
        return this.settingsService.deleteEdizmById(id)
    }

    @ApiOperation({summary: 'Создание ЕИ'})
    @Post('/edizm/update')
    updateEdizm(@Body() dto: UpdateEdizmDto) {
        return this.settingsService.updateEdizmById(dto)
    }

    @ApiOperation({summary: 'Создание Материала'})
    @Post('/material')
    createMaterial(@Body() dto: CreateMaterialDto) {
        return this.settingsService.createMaterial(dto)
    }
    
    @ApiOperation({summary: 'Получить все Типы Материалов'})
    @Get('/material')
    getAllTypeMaterial() {
        return this.settingsService.getAllTypeMaterial()
    }

    @ApiOperation({summary: 'Обновляем тип материала'})
    @Post('/material/update')
    updateTypeMaterial(@Body() dto: UpdateMaterialDto) {
        return this.settingsService.updateMaterial(dto)
    }

    @ApiOperation({summary: 'Удаляем тип материала'})
    @Delete('/material/:id')
    removeMaterial(@Param('id') id: number) {
        return this.settingsService.removeMaterial(id)
    }
} 