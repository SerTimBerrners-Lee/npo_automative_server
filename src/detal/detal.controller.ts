import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemoveDocumentDto } from 'src/files/dto/remove-document.dto';
import { DetalService } from './detal.service';
import { CreateDetalDto } from './dto/create-detal.dto';
import { CreateTypeOperation } from './dto/create-type-operation.dto';
import { UpCreateTechProcessDto } from './dto/up-create-tech-process.dto';
import { UpCreateOperationDto } from './dto/update-create-operation.dto';
import { UpdateDetalDto } from './dto/update-detal.dto';
import { UpOperationTechDto } from './dto/update-operation-tech.dto';
import { UpdateTypeOperation } from './dto/update-type-operation.dto';

@ApiTags('Детали')
@Controller('detal')
export class DetalController {
    constructor(private detalService: DetalService) {}

    @ApiOperation({summary: 'Получаем Массив ID Деталей у которых есть операции'})
    @Get('/operation/include')
    getDetalIncludeOperation() {
        return this.detalService.getDetalIncludeOperation()
    }

    @ApiOperation({summary: 'Получаем все дифицитные детали'})
    @Get('/deficit')
    getAllDeficitCbed() {
        return this.detalService.getAllDeficitDeficit()
    }

    @ApiOperation({summary: 'Получаем все артиклы детали'})
    @Get('/articl')
    getAllDetalArticl() {
        return this.detalService.getAllDetalArticl()
    }

    @ApiOperation({summary: 'Создаем деталь'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ])) 
    @Post('/')
    createNewDetal(
        @Request() req: any, 
        @Body() dto: CreateDetalDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        const authHeader = req.headers.authorization;
        if(!authHeader)
            throw new  HttpException('Пользователь не зарегестрирован', HttpStatus.BAD_REQUEST)
        return this.detalService.createNewDetal(dto, files, authHeader)
    }

    @ApiOperation({summary: 'Обновляем деталь'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/update')
    updateDetal(
        @Request() req: any, 
        @Body() dto: UpdateDetalDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        const authHeader = req.headers.authorization;
        if(!authHeader)
            throw new  HttpException('Пользователь не зарегестрирован', HttpStatus.BAD_REQUEST)
        return this.detalService.updateDetal(dto, files, authHeader)
    }

    @ApiOperation({summary: 'Добавляем файлы к детали'})
    @Post('/file/')
    addFileToDetal(@Body() dto: any) {
        return this.detalService.addFileToDetal(dto)
    }

    @ApiOperation({summary: 'Remove detal by id '})
    @Delete('/:id')
    removeDeleteById(@Request() req: any, @Param('id') id: number, ) {
        const authHeader = req.headers.authorization;
        if(!authHeader)
            throw new  HttpException('Пользователь не зарегестрирован', HttpStatus.BAD_REQUEST)
        return this.detalService.removeDeleteById(id, authHeader)
    }

    @ApiOperation({summary: 'Получить все типы операций'})
    @Get('/typeoperation')
    getAllTypeOperation() {
        return this.detalService.getAllTypeOperation()
    }

    @ApiOperation({summary: 'Get detal by id '})
    @Get('/one/:id')
    getDeleteById(@Param('id') id: number) {
        return this.detalService.getDeleteById(id)
    }
 
    @ApiOperation({summary: 'Get All Detals '})
    @Get('/:light')
    getAllDetals(@Param('light') light: string) {
        return this.detalService.getAllDetals(light)
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

    @ApiOperation({summary: 'Получаем все операции'})
    @Get('/operation/get/')
    getAllOperation() {
        return this.detalService.getAllOperation()
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

    @ApiOperation({summary: 'Создать новый тип операции'})
    @Post('/typeoperation')
    createNewTypeOperation(@Body() dto: CreateTypeOperation) {
        return this.detalService.createNewTypeOperation(dto)
    }

    @ApiOperation({summary: 'Создать новый тип операции'})
    @Post('/typeoperation/update')
    updateTypeOperation(@Body() dto: UpdateTypeOperation) {
        return this.detalService.updateTypeOperation(dto)
    }

    @ApiOperation({summary: 'Удалить тип операции'})
    @Delete('/typeoperation/:id')
    deleteTypeOperationById(@Param() id: any) {
        return this.detalService.deleteTypeOperationById(id)
    }
    
    @ApiOperation({summary: 'Открепляем документ от Детали'})
    @Post('/removedocument/')
    removeDocumentDetal(@Body() dto: RemoveDocumentDto) {
        return this.detalService.removeDocumentDetal(dto)
    }
}
