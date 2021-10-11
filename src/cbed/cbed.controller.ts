import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CbedService } from './cbed.service';
import { CreateCbedDto } from './dto/create-cbed.dto';

@ApiTags('Сборочная единица')
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

    @ApiOperation({summary: 'Получаем все сборочные единицы'})
    @Get('/')
    getAllCbed() {
        return this.cbedService.getAllCbed()
    }

    @ApiOperation({summary: 'Добавить в архив сборочную единицу'})
    @Delete('/:id')
    banCbed(@Param('id') id: number) {
        return this.cbedService.banCbed(id)
    }

    @ApiOperation({summary: 'Получить одну сборочную единицу по ID'})
    @Get('/:id')
    getOneCbedById(@Param('id') id: number) {
        return this.cbedService.getOneCbedById(id)
    }
} 
