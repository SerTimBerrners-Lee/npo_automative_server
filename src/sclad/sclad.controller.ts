import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {UpdateDeficitDto } from './dto/create-deficite.dto';
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
}
