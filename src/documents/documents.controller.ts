import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { ChangeTypeDto } from './dto/change-type.dto';
import CreateDocumentsDto from './dto/create-documents.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('Документы')
@Controller('documents')
export class DocumentsController {
    constructor(private documentService: DocumentsService) {}

    @ApiOperation({summary: 'Создание Документа'})
    @Post()
    create(@Body() dto: CreateDocumentsDto) {
        return this.documentService.createDocument(dto)
    } 

    @ApiOperation({summary: 'Добавление Документов'})
    @Post('/add')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    createDocuments(@Body() docs: [], @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.documentService.createArrDocuments(docs, files)
    }

    @ApiOperation({summary: 'Обновление Документа'})
    @Post('/update')
    updateDocuments(@Body() dto: UpdateDocumentDto) {
        return this.documentService.updateDocuments(dto)
    }

    @ApiOperation({summary: 'Получение всех документов'})
    @Get()
    getAllDocuments() {
        return this.documentService.getAllDocument()
    }

    @ApiOperation({summary: 'Перенос файла в архив'})
    @Delete('/:id')
    banFile(@Param('id') id: number) {
        return this.documentService.banFile(id)
    }

    @ApiOperation({summary: 'Перенос файла в архив'})
    @Get('/:id')
    getFileById(@Param('id') id: number) {
        return this.documentService.getFileById(id)
    }

    @ApiOperation({summary: 'Изменение Типа документа'})
    @Post('/editype')
    changeType(@Body() dto: ChangeTypeDto) {
        return this.documentService.changeType(dto)
    }

    @ApiOperation({summary: 'Удалить документ'})
    @Delete('/delete/:id')
    deleteDocument(@Param('id') id: number) {
        return this.documentService.deleteDocument(id)
    }

    @ApiOperation({summary: 'Привязываем деталь к документу'})
    @Put('/setdetal')
    setDetalForDocument(@Body() dto: any) {
        return this.documentService.setDetalForDocument(dto)
    }

    @ApiOperation({summary: 'Привязываем деталь к документу'})
    @Put('/convert/pdf/')
    convertToPng(@Body() path: any) {
        return this.documentService.convertToPng(path.path)
    }
}
 