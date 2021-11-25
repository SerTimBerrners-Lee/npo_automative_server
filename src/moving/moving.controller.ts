import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { CreateMovingDto } from './dto/create-moving.dto';
import { MovingService } from './moving.service';

@Controller('moving')
export class MovingController {
  constructor(private movingServices: MovingService) {}

  @ApiOperation({summary: 'Создаем перемещения'})
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'document', maxCount: 40}
  ])) 
  @Post('/')
  createNewMoving(
    @Body() dto: CreateMovingDto, 
    @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
    return this.movingServices.createNewMoving(dto, files)
  }

  @ApiOperation({summary: 'Получаем все перемещения'})
  @Get('/')
  getAllMoving() {
      return this.movingServices.getAllMoving()
  }

}
