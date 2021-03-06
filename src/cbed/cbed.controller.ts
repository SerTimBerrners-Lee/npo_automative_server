import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemoveDocumentDto } from 'src/files/dto/remove-document.dto';
import { CbedService } from './cbed.service';
import { CreateCbedDto } from './dto/create-cbed.dto';

@ApiTags('Сборочная единица')
@Controller('cbed')
export class CbedController {
    constructor(private cbedService: CbedService) {}

    @ApiOperation({summary: 'Плучаем аватарку'})
    @Get('/ava/:id')
    getAvatar(@Param('id') id: number) {
        return this.cbedService.getAvatar(id)
    }

    @ApiOperation({summary: 'Получаем Массив ID СБ у которых есть операции'})
    @Get('/operation/')
    getCbedIncludeOperation() {
        return this.cbedService.getCbedIncludeOperation()
    }

    @ApiOperation({summary: 'Получаем все артиклы СБ'})
    @Get('/articl/')
    getAllCbedArticl() {
        return this.cbedService.getAllCbedArticl()
    }

    @ApiOperation({summary: 'Получаем все сборочные единицы в архиве'})
    @Get('/archive/')
    archive() {
        return this.cbedService.archive()
    }

    @ApiOperation({summary: 'Создаем Сборочную единицу'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ])) 
    @Post('/')
    createNewCbed(
        @Body() dto: CreateCbedDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.cbedService.createNewCbed(dto, files)
    }

    @ApiOperation({summary: 'Обновляем Сборочную единицу'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ])) 
    @Post('/update')
    updateCbed(
        @Body() dto: CreateCbedDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.cbedService.updateCbed(dto, files)
    }

    @ApiOperation({summary: 'Получение остатка для склада'})
    @Get('/remains')
    getRenains() {
        return this.cbedService.getRenains();
    }
    
    @ApiOperation({summary: 'Получаем все сборочные единицы'})
    @Get('/:light')
    getAllCbed(@Param('light') light: string) {
        return this.cbedService.getAllCbed(light)
    }

    @ApiOperation({summary: 'Получаем сборочную единицу по определенному полю'})
    @Get('/field/:fields/:id')
    getCbedByField(@Param('fields') fields: string, @Param('id') id: number) {
        return this.cbedService.getCbedByField(fields, id)
    }

    @ApiOperation({summary: 'Прикрепить файл'})
    @Get('/files/:cbed_id/:file_id')
    attachFileToCbed(@Param('cbed_id') cbed_id: number, @Param('file_id') file_id: number) {
        return this.cbedService.attachFileToCbed(cbed_id, file_id)
    }

    @ApiOperation({summary: 'Добавить в архив сборочную единицу'})
    @Delete('/:id')
    banCbed(@Param('id') id: number) {
        return this.cbedService.banCbed(id)
    }

    @ApiOperation({summary: 'Получить одну сборочную единицу по ID'})
    @Get('/one/:id')
    getOneCbedById(@Param('id') id: number) {
        return this.cbedService.getOneCbedById(id)
    }

    @ApiOperation({summary: 'Получить Все что принадлежит сборочной единице'})
    @Get('/belongs/:id')
    getOneCbedBelongs(@Param('id') id: number) {
        return this.cbedService.getOneCbedBelongs(id)
    }

    @ApiOperation({summary: 'Открепляем документ от Сборочной единицы'})
    @Post('/removedocument/')
    removeDocumentCbed(@Body() dto: RemoveDocumentDto) {
        return this.cbedService.removeDocumentCbed(dto)
    }
}  
