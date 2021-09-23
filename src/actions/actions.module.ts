import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Actions } from './actions.model';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';

@Module({
    controllers: [ActionsController],
    providers: [ActionsService],
    imports: [
        SequelizeModule.forFeature([Actions])
    ],

    exports: [ActionsModule],
})
export class ActionsModule {}
