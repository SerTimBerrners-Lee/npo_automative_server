import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentService } from './equipment.service';

@ApiTags('База Оборудования')
@Controller('equipment') 
export class EquipmentController {
    constructor(private equipmentService: EquipmentService) {}

    @ApiOperation({summary: 'Создание типа '})
    @Post('/')
    createEquipmentType(@Body() dto: any) {
        return this.equipmentService.createEquipmentType(dto)
    }

    @ApiOperation({summary: 'Получение типа '})
    @Get('/')
    getEquipmentType() {
        return this.equipmentService.getAllEquipmentType()
    }

    @ApiOperation({summary: 'Обновление типа '})
    @Post('/update')
    updateEquipmentType(@Body() dto: any) {
        return this.equipmentService.updateEquipmentType(dto)
    }

    @ApiOperation({summary: 'Удаление типа '})
    @Delete('/:id')
    removeEquipmentType(@Param('id') id: number) {
        return this.equipmentService.removeEquipmentType(id)
    }

    @ApiOperation({summary: 'Добавление подтипа '})
    @Post('/pt')
    createEquipmentPType(@Body() dto: any) {
        return this.equipmentService.createEquipmentPType(dto)
    }

    @ApiOperation({summary: 'Получение подтипа'})
    @Get('/pt/:id')
    getOneEquipmentPType(@Param('id') id: number) {
        return this.equipmentService.getOneEquipmentPType(id)
    }

    @ApiOperation({summary: 'Получение всех подтипов'})
    @Get('/pt')
    getAllEquipmentPType() {
        return this.equipmentService.getAllEquipmentPType()
    }

    @ApiOperation({summary: 'Обновление подтипа '})
    @Post('/pt/update')
    updateEquipmentPType(@Body() dto: any) {
        return this.equipmentService.updateEquipmentPType(dto)
    }

    @ApiOperation({summary: 'Удаление типа '})
    @Delete('/pt/:id')
    removeEquipmentPType(@Param('id') id: number) {
        return this.equipmentService.removeEquipmentPType(id)
    }

    @ApiOperation({summary: 'Создаем оборудование'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/eq')
    createEquipment(@Body() dto: CreateEquipmentDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.equipmentService.createEquipment(dto, files)
    }

    @ApiOperation({summary: 'Получение подтипа'})
    @Get('/eq/:id')
    getOneEquipment(@Param('id') id: number) {
        return this.equipmentService.getOneEquipment(id)
    }

    @ApiOperation({summary: 'Обновляем оборудование'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/eq/update')
    updateEquipment(@Body() dto: UpdateEquipmentDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.equipmentService.updateEquipmqnt(dto, files)
    }

    @ApiOperation({summary: 'Удаление прикрепленного файла '})
    @Delete('/file/:id')
    removeFileEquipment(@Param('id') id: number) {
        return this.equipmentService.removeFileEquipment(id)
    } 

    @ApiOperation({summary: 'Занесения подтипа в архив'})
    @Delete('/ban/:id')
    banEquipment(@Param('id') id: number) {
        return this.equipmentService.banEquipment(id) 
    } 

    @ApiOperation({summary: 'Получение всех подтипов'})
    @Get('/eq')
    getAllEquipment() {
        return this.equipmentService.getAllEquipment()
    }

}
