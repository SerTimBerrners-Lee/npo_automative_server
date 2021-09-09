import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { CreatePTInstrumentDto } from './dto/create-pt-instrument.dto';
import { UpdateTInstrumentDto } from './dto/update-instrument.dto';
import { UpdatePTInstrumentDto } from './dto/update-pt.dto';
import { InstrumentService } from './instrument.service';

@ApiTags('База Инструмента')
@Controller('instrument')
export class InstrumentController {
    constructor(private instrumentService: InstrumentService) {}

    @ApiOperation({summary: 'Создание типа '})
    @Post('/')
    createInstrument(@Body() dto: CreateInstrumentDto) {
        return this.instrumentService.createInstrument(dto)
    }

    @ApiOperation({summary: 'Получить все типы '})
    @Get('/')
    getAllTInstrument() {
        return this.instrumentService.getAllTInstrument()
    }

    @ApiOperation({summary: 'Удаление Типа '})
    @Delete('/:id')
    removeTInstrument(@Param('id') id: number) {
        return this.instrumentService.removeTInstrument(id)
    } 

    @ApiOperation({summary: 'Обновление Типа '})
    @Post('/update')
    updateTInstrument(@Body() dto: UpdateTInstrumentDto) {
        console.log(dto)
        return this.instrumentService.updateTInstrument(dto)
    } 

    @ApiOperation({summary: 'Добавляем подтип'})
    @Post('/pt')
    createPTInstrument(@Body() dto: CreatePTInstrumentDto) {
        return this.instrumentService.createPTInstrument(dto)
    }

    @ApiOperation({summary: 'Удаление подтипа '})
    @Delete('/pt/:id')
    removePTInstrument(@Param('id') id: number) {
        console.log("IDIDIIDIDIDIIDI", id)
        return this.instrumentService.removePTInstrument(id)
    } 

    @ApiOperation({summary: 'Обновление подтипа '})
    @Post('/pt/update')
    updatePTInstrument(@Body() dto: UpdatePTInstrumentDto) {
        return this.instrumentService.updatePTInstrument(dto)
    } 
}
