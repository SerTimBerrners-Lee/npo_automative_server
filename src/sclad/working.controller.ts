import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateWorkingDto } from './dto/create-working.dto';
import { WorkingService } from './working.service';

@Controller('working')
export class WorkingController {

    constructor(private workindService: WorkingService) {}

    @ApiOperation({summary: 'Получить все Рабочие зоны'})
    @Get('/one/:id')
    getOneWorking(@Param('id') id: number) {
        return this.workindService.getOneWorking(id);
    }

    @ApiOperation({summary: 'Кидаем или заюираем из Архива'})
    @Delete('/banned/:id')
    bannedOneWorking(@Param('id') id: number) {
        return this.workindService.bannedOneWorking(id);
    }

    @ApiOperation({summary: 'Получить Количество Рабочих зон'})
    @Get('/count')
    getCountWorking() {
        return this.workindService.getCountWorking()
    }

    @ApiOperation({summary: 'Получить все Рабочие зоны'})
    @Get('/all/:archive')
    getAllWorking(@Param('archive') archive: string) {
        return this.workindService.getAllWorking(archive)
    }

    @ApiOperation({summary: 'Создаем Новую рабочую зону'})
    @Post('/')
    createWorking(@Body() dto: CreateWorkingDto) {
      return this.workindService.createWorking(dto)
    }
}
    