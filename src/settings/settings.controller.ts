import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEdizmDto } from './dto/create-edizm.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { CreatePodMaterialDto } from './dto/create-pod-material.dto';
import { CreatePodPodMaterial } from './dto/create-pod-pod-material.dto';
import { CreateTypeEdizmDto } from './dto/create-type-edizm.dto';
import { UpdateEdizmDto } from './dto/update-edizm.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { SettingsService } from './settings.service';

@ApiTags('Настройки ПО')
@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @ApiOperation({summary: 'Создание типа ЕИ'})
    @Post('/typeedizm')
    createTypeEdizm(@Body() dto: CreateTypeEdizmDto) {
        return this.settingsService.createTypeEdizm(dto)
    }

    @ApiOperation({summary: 'Создание ЕИ'})
    @Post('/edizm')
    crateEdizm(@Body() dto: CreateEdizmDto) {
        return this.settingsService.createEdizm(dto)
    }

    @ApiOperation({summary: 'Получить все ЕИ'})
    @Get('/edizm')
    getAllEdizm() {
        return this.settingsService.getAllEdizm()
    }

    @ApiOperation({summary: 'Получить все типы ЕИ'})
    @Get('/typeedizm')
    getAllTypeEdizm() {
        return this.settingsService.getAllTypeEdizm()
    }

    @ApiOperation({summary: 'Удаление ЕИ по ID'})
    @Delete('/edizm/:id')
    deleteEdizmById(@Param('id') id: number) {
        return this.settingsService.deleteEdizmById(id)
    }

    @ApiOperation({summary: 'Создание ЕИ'})
    @Post('/edizm/update')
    updateEdizm(@Body() dto: UpdateEdizmDto) {
        return this.settingsService.updateEdizmById(dto)
    }

    @ApiOperation({summary: 'Создание Материала'})
    @Post('/material')
    createMaterial(@Body() dto: CreateMaterialDto) {
        return this.settingsService.createMaterial(dto)
    }
    
    @ApiOperation({summary: 'Получить все Типы Материалов'})
    @Get('/material')
    getAllTypeMaterial() {
        return this.settingsService.getAllTypeMaterial()
    }

    @ApiOperation({summary: 'Обновляем тип материала'})
    @Post('/material/update')
    updateTypeMaterial(@Body() dto: UpdateMaterialDto) {
        return this.settingsService.updateMaterial(dto)
    }

    @ApiOperation({summary: 'Удаляем тип материала'})
    @Delete('/material/:id')
    removeMaterial(@Param('id') id: number) {
        return this.settingsService.removeMaterial(id)
    }

    @ApiOperation({summary: 'Создаем под тип материала'})
    @Post('/podtype')
    createPodMaterial(@Body() dto: CreatePodMaterialDto) {
        console.log(dto)
        return this.settingsService.createPodMaterial(dto)
    }

    @ApiOperation({summary: 'Удаляем под тип материала'})
    @Delete('/podtype/:id')
    removePodMaterial(@Param('id') id: number) {
        return this.settingsService.removePodMaterial(id)
    }
    
    @ApiOperation({summary: 'Обновляем подтип материала'})
    @Post('/podtype/update')
    updatePodTypeMaterial(@Body() dto: CreatePodMaterialDto) {
        return this.settingsService.updatePodTypeMaterial(dto)
    }

    @ApiOperation({summary: 'Создаем подтип подтипа материала'})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'document', maxCount: 40}
    ]))
    @Post('/podpodtype/')
    crteatePodPodMaterial(@Body() dto: CreatePodPodMaterial, @UploadedFiles() files: { document?: Express.Multer.File[]} ) {
        return this.settingsService.createAndUpdatePodPodMaterial(dto, files)
    }

    @ApiOperation({summary: 'get all typeMaterials'})
    @Get('/typematerial/:instans')
    getAllPodTypeMaterial(@Param('instans') instans: string | number) {
        return this.settingsService.getAllPodTypeMaterial(instans)
    }

    @ApiOperation({summary: 'get all pod typeMaterials'})
    @Get('/materials/podtypematerial')
    getPodPodMaterial() {
        return this.settingsService.getPodPodMaterial()
    } 

    @ApiOperation({summary: 'get one pod typeMaterials'})
    @Get('/typematerialid/:id')
    getPodMaterialById(@Param('id') id: number) {
        return this.settingsService.getPodMaterialById(id)
    }

    @ApiOperation({summary: 'Удаляем под подтип материала'})
    @Delete('/podpodtype/:id')
    removePPMaterial(@Param('id') id: number) {
        return this.settingsService.removePPMById(id)
    }
    
    @ApiOperation({summary: 'Добавляем подтип материала в архив'})
    @Get('/podpodtype/:id')
    banPPM(@Param('id') id: number) {
        return this.settingsService.banPPMById(id)
    }

    @ApiOperation({summary: 'Получаем один Полдтип материала со всеми полями'})
    @Get('/podpodtype/get/:id')
    getOnePPT(@Param('id') id: number) {
        return this.settingsService.getOnePPT(id)
    }

    @ApiOperation({summary: 'Получаем все Полдтип материала со всеми полями'})
    @Get('/podpodtype/')
    getAllPPT() {
        return this.settingsService.getAllPPT()
    }

    @ApiOperation({summary: 'Получаем Дефицит материала'})
    @Get('/materialdeficit/')
    getAllDeficit() {
        return this.settingsService.getDeficitMaterial()
    }

    @ApiOperation({summary: 'Получаем Заказаный материал'})
    @Get('/materialshipment')
    getAllShipmentsPPM() {
        return this.settingsService.getAllShipmentsPPM()
    }

    @ApiOperation({summary: 'Меняем значение для норм-часа'})
    @Post('/normhors/')
    updateNormHors(@Body() znach: number) {
        return this.settingsService.updateNormHors(znach)
    }

    @ApiOperation({summary: 'Получаем Норма-час'})
    @Get('/normhors')
    getNormHors() {
        return this.settingsService.getNormHors()
    }

    @ApiOperation({summary: 'Получаем Дефицит материала'})
    @Get('/materialprovider/')
    getAllMaterialProvider() {
        return this.settingsService.getAllMaterialProvider()
    }

    @ApiOperation({summary: 'Получаем Дефицит материала'})
    @Get('/materialprovider/:id')
    getAllMaterialProviderById(@Param('id') id: number) {
        return this.settingsService.getAllMaterialProviderById(id)
    }

    @ApiOperation({summary: 'Получаем резервные копии'})
    @Get('/db')
    getAllDB() {
        return this.settingsService.getAllDB()
    }

    @ApiOperation({summary: 'Создать новую резервную копию'})
    @Get('/db/new')
    newDB() {
        return this.settingsService.newDB()
    }

    @ApiOperation({summary: 'Создать новую резервную копию'})
    @Delete('/db/:name_dump')
    dropDumpDB(@Param('name_dump') name_dump: string) {
        return this.settingsService.dropDumpDB(name_dump)
    }

    @ApiOperation({summary: 'Получить часы бездействия пользователя'})
    @Get('/inaction')
    inactionGet() {
        return this.settingsService.inactionGet()
    }

    @ApiOperation({summary: 'Задать часы бездействия пользователя'})
    @Put('/inaction/:hors')
    inactionChange(@Param('hors') hors: number ) {
        return this.settingsService.inactionChange(hors)
    }
}