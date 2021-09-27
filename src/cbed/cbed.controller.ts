import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { CbedService } from './cbed.service';
import { CreateCbedDto } from './dto/create-cbed.dto';

@Controller('cbed')
export class CbedController {
    constructor(private cbedService: CbedService) {}

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
    @ApiOperation({summary: 'Получаем все сборочные единицы'})
    @Get('/')
    getAllCbed() {
        return this.cbedService.getAllCbed()
    }
} 
