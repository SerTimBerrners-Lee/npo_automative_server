import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { CreateNameInstrumentDto } from './dto/create-name-instrument.dto';
import { CreatePTInstrumentDto } from './dto/create-pt-instrument.dto';
import { UpdateTInstrumentDto } from './dto/update-instrument.dto';
import { UpdateNameInstrumentDto } from './dto/update-name-instrument.dto';
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
        return this.instrumentService.removePTInstrument(id)
    } 

    @ApiOperation({summary: 'Обновление подтипа '})
    @Post('/pt/update')
    updatePTInstrument(@Body() dto: UpdatePTInstrumentDto) {
        return this.instrumentService.updatePTInstrument(dto)
    } 

    @ApiOperation({summary: 'Получить все подтипы '})
    @Get('/pt/:id')
    getAllPTInstrument(@Param('id') id: number) {
        return this.instrumentService.getAllPTInstrument(id)
    }

    @ApiOperation({summary: 'Создаем наименование инструмента или оснастки'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/nameinstrument')
    crteateNameInstrument(@Body() dto: CreateNameInstrumentDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.instrumentService.createNameInstrument(dto, files)
    }

    @ApiOperation({summary: 'Получить  наименование '})
    @Get('/name/:id')
    getNameInstrument(@Param('id') id: number) {
        return this.instrumentService.getNameInstrument(id)
    }
    @ApiOperation({summary: 'Удаление подтипа '})
    @Delete('/file/:id')
    removeFileInstrument(@Param('id') id: number) {
        return this.instrumentService.removeFileInstrument(id)
    } 

    @ApiOperation({summary: 'Обновляем наименование инструмента или оснастки'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/nameinstrument/update')
    updateNameInstrument(@Body() dto: UpdateNameInstrumentDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.instrumentService.updateNameInstrument(dto, files)
    }

    @ApiOperation({summary: 'Удаление подтипа '})
    @Delete('/ban/:id')
    banNameInstrument(@Param('id') id: number) {
        return this.instrumentService.banNameInstrument(id)
    } 
}
