import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderService } from './provider.service';

@ApiTags('База Поставщиков')
@Controller('provider')
export class ProviderController {
    constructor(private providerService: ProviderService) {}

    @ApiOperation({summary: 'Создаем подтип подтипа материала'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/')
    createProvider(@Body() dto: CreateProviderDto, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        console.log(dto)
        return this.providerService.createProvider(dto, files)
    }

    @Get('/')
    getProviders() {
        return this.providerService.getProviders()
    }

    @Get('/ban/:id')
    banProviders(@Param('id') id: number) {
        return this.providerService.banProvider(id)
    }
}
 