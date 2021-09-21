import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { DetalService } from './detal.service';
import { CreateDetalDto } from './dto/create-detal.dto';
import { UpCreateTechProcessDto } from './dto/up-create-tech-process.dto';
import { UpCreateOperationDto } from './dto/update-create-operation.dto';
import { UpdateDetalDto } from './dto/update-detal.dto';
import { UpOperationTechDto } from './dto/update-operation-tech.dto';

@Controller('detal')
export class DetalController {
    constructor(private detalService: DetalService) {}

    @ApiOperation({summary: 'Создаем деталь'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/')
    createNewDetal(@Body() dto: CreateDetalDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.createNewDetal(dto, files)
    }

    @ApiOperation({summary: 'Обновляем деталь'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/update')
    updateDetal(@Body() dto: UpdateDetalDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.updateDetal(dto, files)
    }

    @ApiOperation({summary: 'Remove detal by id '})
    @Delete('/:id')
    removeDeleteById(@Param('id') id: number) {
        return this.detalService.removeDeleteById(id)
    }
 
    @ApiOperation({summary: 'Get All Detals '})
    @Get('/')
    getAllDetals() {
        return this.detalService.getAllDetals()
    }

    @ApiOperation({summary: 'Создаем операцию'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/operation')
    createNewOperation(@Body() dto: UpCreateOperationDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.createNewOperation(dto, files)
    }

    @ApiOperation({summary: 'Обновляем операцию'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/operation/update')
    updateOperation(@Body() dto: UpCreateOperationDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.updateOperation(dto, files)
    }

    @ApiOperation({summary: 'Получаем операцию по ID'})
    @Get('/operation/get/:id')
    getOneOperationById(@Param('id') id: number) {
        return this.detalService.getOneOperationById(id)
    }

    @ApiOperation({summary: 'Обновляем основной инструмент и оборудование'})
    @Post('/operation/up/tech')
    updateOperationTech(@Body() dto: UpOperationTechDto) {
        return this.detalService.updateOperationTech(dto)
    }

    @ApiOperation({summary: 'Добавляем в бан операцию'})
    @Delete('/operation/:id')
    banOperation(@Param('id') id: number) {
        return this.detalService.banOperation(id)
    }

    @ApiOperation({summary: 'Создаем Технический процесс'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/techprocess')
    createNewTechProcess(@Body() dto: UpCreateTechProcessDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.createNewTechProcess(dto, files)
    }

    @ApiOperation({summary: 'Получить технологический процесс по id'})
    @Get('/techprocess/:id')
    getTechProcessById(@Param('id') id: number){
        return this.detalService.getTechProcessById(id)
    }

}
