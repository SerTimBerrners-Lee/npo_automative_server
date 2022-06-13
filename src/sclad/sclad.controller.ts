import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

    @ApiOperation({summary: 'Получить все марки по операции.'})
    @Get('/marks/byoperation/:_id')
    getMarksByOperation(@Param('_id') id: number) {
        return this.scladService.getMarksByOperation(id);
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

    @ApiOperation({summary: 'Получаем Дефицит материала'})
    @Get('/materialdeficit')
    getAllMaterialDeficit() {
        return this.scladService.getAllMaterialDeficit()
    }

    @Get('/removeTypeEZ')
    removeTypeEZ() {
        return this.scladService.removeTypeEZ();
    }

    @ApiOperation({summary: 'Получаем Дефицит для отдельного зпепзп'})
    @Get('/materialdeficit/shipments/:id/:type')
    materialShipmentsType(@Param('id') id: number, @Param('type') type: string) {
        return this.scladService.materialShipmentsType(id, type)
    }

    @ApiOperation({summary: 'Получаем Дефицит материала'})
    @Get('/materialparents/:id')
    getMaterialParents(@Param('id') id: number) {
        return this.scladService.getMaterialParentsDeficit(id)
    }

    @ApiOperation({summary: 'Получаем Дефицит материала'})
    @Get('/materialonecshipments/:id')
    getMaterialShipmentsAttations(@Param('id') id: number) {
        return this.scladService.getMaterialShipmentsAttations(id)
    }
}
    