import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { DetalService } from './detal.service';
import { CreateDetalDto } from './dto/create-detal.dto';

@Controller('detal')
export class DetalController {
    constructor(private detalService: DetalService) {}

    @ApiOperation({summary: 'Создаем оборудование'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/')
    createEquipment(@Body() dto: CreateDetalDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        
    }
}
