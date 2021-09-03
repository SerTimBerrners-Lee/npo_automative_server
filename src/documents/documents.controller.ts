import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { ChangeTypeDto } from './dto/change-type.dto';
import CreateDocumentsDto from './dto/create-documents.dto';

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
        this.documentService.createArrDocuments(docs, files)
    }

    @ApiOperation({summary: 'Получение всех документов'})
    @Get()
    getAllDocuments() {
        return this.documentService.getAllDocument()
    }

    @ApiOperation({summary: 'Перенос файла в архив'})
    @Get('/:id')
    banFile(@Param('id') id: number) {
        return this.documentService.banFile(id)
    }

    @ApiOperation({summary: 'Изменение Типа документа'})
    @Post('/editype')
    changeType(@Body() dto: ChangeTypeDto) {
        console.log(dto)
        return this.documentService.changeType(dto)
    }
}
 