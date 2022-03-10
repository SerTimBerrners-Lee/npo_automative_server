import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { CreateTypeOperation } from "./dto/create-type-operation.dto"
import { UpCreateOperationDto } from "./dto/update-create-operation.dto"
import { UpOperationTechDto } from "./dto/update-operation-tech.dto"
import { UpdateTypeOperation } from "./dto/update-type-operation.dto"
import { OperationService } from "./operation.service"

@ApiTags('Операции')
@Controller('operation')
export class OperationController {
   constructor(private operationService: OperationService) {}

    @ApiOperation({summary: 'Создаем операцию'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/operation')
    createNewOperation(@Body() dto: UpCreateOperationDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.operationService.createNewOperation(dto, files)
    }

    @ApiOperation({summary: 'Обновляем операцию'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/operation/update')
    updateOperation(@Body() dto: UpCreateOperationDto, 
        @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.operationService.updateOperation(dto, files)
    }

    @ApiOperation({summary: 'Получаем операцию по ID'})
    @Get('/operation/get/:id')// +
    getOneOperationById(@Param('id') id: number) {
        return this.operationService.getOneOperationById(id)
    }

    @ApiOperation({summary: 'Получаем все операции'})
    @Get('/operation/get/')
    getAllOperation() {
        return this.operationService.getAllOperation()
    }

    @ApiOperation({summary: 'Обновляем основной инструмент и оборудование'})
    @Post('/operation/up/tech')
    updateOperationTech(@Body() dto: UpOperationTechDto) {
        return this.operationService.updateOperationTech(dto)
    }

    @ApiOperation({summary: 'Добавляем в бан операцию'})
    @Delete('/operation/:id')
    banOperation(@Param('id') id: number) {
        return this.operationService.banOperation(id)
    }

    @ApiOperation({summary: 'Получить все типы операций'})
    @Get('/typeoperation')
    getAllTypeOperation() {
        return this.operationService.getAllTypeOperation()
    }

    @ApiOperation({summary: 'Создать новый тип операции'})
    @Post('/typeoperation')  
    createNewTypeOperation(@Body() dto: CreateTypeOperation) {
        return this.operationService.createNewTypeOperation(dto)
    }

    @ApiOperation({summary: 'Создать новый тип операции'})
    @Post('/typeoperation/update')
    updateTypeOperation(@Body() dto: UpdateTypeOperation) {
        return this.operationService.updateTypeOperation(dto)
    }

    @ApiOperation({summary: 'Удалить тип операции'})
    @Delete('/typeoperation/:id') 
    deleteTypeOperationById(@Param() id: any) { 
        return this.operationService.deleteTypeOperationById(id)
    }
}