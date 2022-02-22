import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateWorkingDto } from './dto/create-working.dto';
import { WorkingService } from './working.service';

@Controller('working')
export class WorkingController {

    constructor(private workindService: WorkingService) {}

    @ApiOperation({summary: 'Получить Количество Рабочих зон'})
    @Get('/count')
    getCountWorking() {
        return this.workindService.getCountWorking()
    }

    @ApiOperation({summary: 'Получить все Рабочие зоны'})
    @Get('/')
    getMarks() {
        return this.workindService.getAllWorking()
    }

    @ApiOperation({summary: 'Создаем Новую рабочую зону'})
    @Post('/')
    createWorking(@Body() dto: CreateWorkingDto) {
      return this.workindService.createWorking(dto)
    }
}
    