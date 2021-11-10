import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InventaryService } from './inventary.service';

@ApiTags('База Непроизводственной техники и инвентаря') 
@Controller('inventary')
export class InventaryController {
  constructor(private inventaryService: InventaryService) {}

  @ApiOperation({summary: 'Создание типа '})
  @Post('/')
  createPInventary(@Body() dto: any) {
    return this.inventaryService.createPInventary(dto)
  }

  @ApiOperation({summary: 'Обновление типа '})
  @Put('/')
  updatePInventary(@Body() dto: any) {
    return this.inventaryService.updatePInventary(dto)
  }

  @ApiOperation({summary: 'Удаление типа '})
  @Delete('/:id')
  deletePInventary(@Param('id') id: number) {
    return this.inventaryService.deletePInventary(id)
  }

  @ApiOperation({summary: 'Получить все типы '})
  @Get('/')
  getAllPInventary() {
    return this.inventaryService.getAllPInventary()
  }

  @ApiOperation({summary: 'Создание под типа '})
  @Post('/pt/')
  createPTInventary(@Body() dto: any) {
    return this.inventaryService.createPTInventary(dto)
  }

  @ApiOperation({summary: 'Обновление под типа '})
  @Put('/pt/')
  updatePTInventary(@Body() dto: any) {
    return this.inventaryService.updatePTInventary(dto)
  }

  @ApiOperation({summary: 'Удаление под типа '})
  @Delete('/pt/:id')
  deletePTInventary(@Param('id') id: number) {
    return this.inventaryService.deletePTInventary(id)
  }

  @ApiOperation({summary: 'Получить все под типы '})
  @Get('/pt/')
  getAllPTInventary() {
    return this.inventaryService.getAllPTInventary()
  }
}
