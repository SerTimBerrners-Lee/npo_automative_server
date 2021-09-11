import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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


    

}
