import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionsService } from './actions.service';

@ApiTags('Действия')
@Controller('actions')
export class ActionsController {
    constructor(private actionsService: ActionsService) {}


    @ApiOperation({summary: 'Получить все действия'})
    @Get()
    getAllActions() {
        return this.actionsService.getAllActions();
    } 
}
