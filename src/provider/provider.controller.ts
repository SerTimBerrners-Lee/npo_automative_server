import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDeliveriesDto } from './dto/create-deliveries.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { CreateWaybillDto } from './dto/create-waybill.dto';
import { ProviderService } from './provider.service';

@ApiTags('База Поставщиков')
@Controller('provider')
export class ProviderController {
    constructor(private providerService: ProviderService) {}

    @ApiOperation({summary: 'Создаем поставщика'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/')
    createProvider(@Body() dto: CreateProviderDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.providerService.createProvider(dto, files)
    }

    @ApiOperation({summary: 'Поулчаем поставщика'})
    @Get('/') 
    getProviders() {
        return this.providerService.getProviders()
    }
    
    @ApiOperation({summary: 'Поулчаем поставщика в бане'})
    @Get('/archive') 
    getProvidersArchive() {
        return this.providerService.getProvidersArchive()
    }

    @ApiOperation({summary: 'Поулчаем поставщика по id'})
    @Get('/ban/:id')
    banProviders(@Param('id') id: number) {
        return this.providerService.banProvider(id)
    }

    @ApiOperation({summary: 'Создаем поставку'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/deliveried')
    createDeliveries(@Body() dto: CreateDeliveriesDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.providerService.createDeliveries(dto, files)
    }

    @Get('/deliveried')
    getAllDeliveried() {
        return this.providerService.getAllDeliveried()
    }

    @ApiOperation({summary: 'Создаем подставку'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/deliveried/update')
    updateDeliveries(@Body() dto: CreateDeliveriesDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.providerService.updateDeliveries(dto, files)
    }

    @Get('/deliveriedcoming')
    getAllDeliveriedComing() {
        return this.providerService.getAllDeliveriedComing()
    }

    @ApiOperation({summary: 'Создаем Накладную'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/waylbil/create')
    createWaybill(@Body() dto: CreateWaybillDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.providerService.createWaybill(dto, files)
    }

    @Get('/waylbil')
    getAllWaybill() {
        return this.providerService.getAllWaybill()
    }

    @ApiOperation({summary: 'Прикрепить файл'})
    @Get('/files/:provider_id/:file_id')
    attachFileToProvider(@Param('provider_id') provider_id: number, @Param('file_id') file_id: number) {
        return this.providerService.attachFileToProvider(provider_id, file_id)
    }
}
  