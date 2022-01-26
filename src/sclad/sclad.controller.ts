import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {UpdateDeficitDto } from './dto/create-deficite.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { ScladService } from './sclad.service';

@Controller('sclad')
export class ScladController {

    constructor(private scladService: ScladService) {}

    @ApiOperation({summary: 'Обновить таблицу дефицита.'})
    @Post('/deficit')
    updateDeficit(@Body() dto: UpdateDeficitDto) {
        return this.scladService.updateDeficit(dto)
    }

    @ApiOperation({summary: 'Получить таблицу дефицита.'})
    @Get('/deficit')
    getDeficit() {
        return this.scladService.getDeficit()
    }

    @ApiOperation({summary: 'Получить все марки.'})
    @Get('/marks')
    getMarks() {
        return this.scladService.getMarks()
    }

    @ApiOperation({summary: 'Добавление отметки о выполнении'})
    @Post('/mark')
    createMark(@Body() dto: CreateMarkDto) {
        return this.scladService.createMark(dto)
    }

    @ApiOperation({summary: 'Получаем все дифицитные детали'})
    @Get('/deficit/detal')
    getAllDeficitDetal() {
        return this.scladService.getAllDeficitDetal()
    }

    @ApiOperation({summary: 'Получаем все дифицитные сборочные единицы'})
    @Get('/deficit/cbed')
    getAllDeficitCbed() {
        return this.scladService.getAllDeficitCbed()
    }

    @ApiOperation({summary: 'Получаем все дифицитные Продукты'})
    @Get('/deficit/product')
    getAllDeficitProduct() {
        return this.scladService.getAllDeficitProduct()
    }
}
    