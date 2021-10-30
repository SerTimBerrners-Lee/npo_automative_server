import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';

@Controller('buyer')
export class BuyerController {
    constructor(private buyerService: BuyerService) {}

    @ApiOperation({summary: 'Создаем покупателя'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/')
    createBuyer(@Body() dto: CreateBuyerDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.buyerService.createBuyer(dto, files)
    }

    @ApiOperation({summary: 'Обновляем покупателя'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/update')
    updateBuyer(@Body() dto: CreateBuyerDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.buyerService.createBuyer(dto, files)
    }

    @ApiOperation({summary: 'Получаем всех покупателей'})
    @Get('/')
    getBuyers() { 
        return this.buyerService.getBuyers()
    }

    @ApiOperation({summary: 'Перенести в архив покупателя'})
    @Delete('/:id')
    ban(@Param('id') id: number) { 
        return this.buyerService.ban(id)
    }
}
  