import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { DetalService } from './detal.service';
import { CreateDetalDto } from './dto/create-detal.dto';
import { CreateOperationDto } from './dto/create-operation.dto';

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

    @ApiOperation({summary: 'Создаем деталь'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/operation')
    createNewOperation(@Body() dto: CreateOperationDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.detalService.createNewOperation(dto, files)
    }
}
