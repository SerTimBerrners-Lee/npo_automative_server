import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemoveDocumentDto } from 'src/files/dto/remove-document.dto';
import { DetalService } from './detal.service';
import { CreateDetalDto } from './dto/create-detal.dto';
import { UpCreateTechProcessDto } from './dto/up-create-tech-process.dto';
import { UpdateDetalDto } from './dto/update-detal.dto';

@ApiTags('Детали')
@Controller('detal')
export class DetalController {
    constructor(private detalService: DetalService) {}


    @ApiOperation({summary: 'Получает определенные отрибуты'})
    @Post('/getattribute/:id/')
	getAtributeModelSh(@Param('id') id: number, @Body() dto: any) {
		return this.detalService.getAtribute(id, dto);
	}

    @ApiOperation({summary: 'Плучаем аватарку'})
    @Get('/ava/:id')
    getAvatar(@Param('id') id: number) {
        return this.detalService.getAvatar(id)
    }

    @ApiOperation({summary: 'Получаем Массив ID Деталей у которых есть операции'})
    @Get('/operation/include')
    getDetalIncludeOperation() {
        return this.detalService.getDetalIncludeOperation()
    }

    @ApiOperation({summary: 'Получаем все артиклы детали'})
    @Get('/articl')
    getAllDetalArticl() {
        return this.detalService.getAllDetalArticl()
    }

    @ApiOperation({summary: 'Получаем все детали в архиве'})
    @Get('/archive/')
    archive() {
        return this.detalService.archive()
    }

    @ApiOperation({summary: 'Создаем деталь'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ])) 
    @Post('/')
    createNewDetal(
        @Body() dto: CreateDetalDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.createNewDetal(dto, files)
    }

    @ApiOperation({summary: 'Обновляем деталь'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/update')
    updateDetal(
        @Body() dto: UpdateDetalDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.updateDetal(dto, files)
    }

    @ApiOperation({summary: 'Добавляем файлы к детали'})
    @Post('/file/')
    addFileToDetal(@Body() dto: any) {
        return this.detalService.addFileToDetal(dto)
    }

    @ApiOperation({summary: 'Получение остатка для склада'})
    @Get('/remains')
    getRenains() {
        return this.detalService.getRenains()
    }

    @ApiOperation({summary: 'Remove detal by id '})
    @Delete('/:id')
    removeDeleteById(@Param('id') id: number, ) {
        return this.detalService.removeDeleteById(id)
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
    
    @ApiOperation({summary: 'Открепляем документ от Детали'})
    @Post('/removedocument/')
    removeDocumentDetal(@Body() dto: RemoveDocumentDto) {
        return this.detalService.removeDocumentDetal(dto)
    }
}
