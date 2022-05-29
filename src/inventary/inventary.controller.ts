import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInventaryDto } from './dto/create-inventary.dto';
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

  @ApiOperation({summary: 'Получить весь инвентарь с баном'})
  @Get('/name/archive/')
  getArchive() {
    return this.inventaryService.getArchive()
  }

  @ApiOperation({summary: 'Получить инвентарь по id '})
  @Get('/name/:id')
  getInventaryById(@Param('id') id: number) {
    return this.inventaryService.getInventaryById(id)
  }

  @ApiOperation({summary: 'Получить весь инвентарь'})
  @Get('/name/')
  getAllInventary() {
    return this.inventaryService.getAllInventary()
  }

  @ApiOperation({summary: 'Создать новый инвентарь '})
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'document', maxCount: 40}
  ]))
  @Post('/name/')
  createNewInventary(
    @Body() dto: any, @UploadedFiles() 
    files: { document?: Express.Multer.File[]}) {
    return this.inventaryService.createNewInventary(dto, files)
  }

  @ApiOperation({summary: 'Обновить инвентарь '})
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'document', maxCount: 40}
  ]))
  @Put('/name/')
  updateInventary(
    @Body() dto: any, @UploadedFiles() 
    files: { document?: Express.Multer.File[]}) {
    return this.inventaryService.updateInventary(dto, files)
  }
  
  @ApiOperation({summary: 'Удаление наименования'})
  @Delete('/name/:id')
  deleteInventaryById(@Param('id') id: number) {
    return this.inventaryService.deleteInventaryById(id)
  }

  @ApiOperation({summary: 'Прикрепить файл'})
  @Get('/files/:inventary_id/:file_id')
  attachFileToInventary(@Param('inventary_id') inventary_id: number, @Param('file_id') file_id: number) {
      return this.inventaryService.attachFileToInventary(inventary_id, file_id)
  }
} 
