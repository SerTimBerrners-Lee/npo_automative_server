import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { RemoveDocumentDto } from 'src/files/dto/remove-document.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @ApiOperation({summary: 'Создаем Изделие'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ])) 
    @Post('/')
    createNewProduct(
        @Body() dto: CreateProductDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.productService.createNewProduct(dto, files)
    }

    @ApiOperation({summary: 'Обновляем Изделие'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ])) 
    @Post('/update')
    updateProduct(
        @Body() dto: CreateProductDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.productService.updateProduct(dto, files)
    }

    @ApiOperation({summary: 'Получаем все артиклы продукции'})
    @Get('/articl')
    getAllProductArticl() {
        console.log('productArticl')
        return this.productService.getAllProductArticl()
    }

    @ApiOperation({summary: 'Получаем все Изделия'})
    @Get('/:light')
    getAllProduct(@Param('light') light: string) {
        return this.productService.getAllProduct(light)
    }

    @ApiOperation({summary: 'Получаем Изделиe by ID'})
    @Get('/light/:id')
    getProductByIdLight(@Param('id') id: number) {
        return this.productService.getProductByIdLight(id)
    }

    @ApiOperation({summary: 'Добавляем Изделие в Архив'})
    @Delete('/:id')
    banProduct(@Param('id') id: number) {
        return this.productService.banProduct(id)
    }

    @ApiOperation({summary: 'Открепляем документ от Продукта'})
    @Post('/removedocument/')
    removeDocumentProduct(@Body() dto: RemoveDocumentDto) {
        return this.productService.removeDocumentProduct(dto)
    }
}
 