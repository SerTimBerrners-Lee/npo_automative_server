import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @ApiOperation({summary: 'Создаем Сборочную единицу'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ])) 
    @Post('/')
    createNewProduct(
        @Body() dto: CreateProductDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.productService.createNewProduct(dto, files)
    }
    @ApiOperation({summary: 'Получаем все сборочные единицы'})
    @Get('/')
    getAllProduct() {
        return this.productService.getAllProduct()
    }
}
 