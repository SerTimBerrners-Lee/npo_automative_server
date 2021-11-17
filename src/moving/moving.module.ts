import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeMethod } from 'sequelize/types/lib/utils';
import { MovingController } from './moving.controller';
import { Moving } from './moving.model';
import { MovingService } from './moving.service';

@Module({
  controllers: [MovingController],
  providers: [MovingService],
  imports: [
    SequelizeModule.forFeature([
      Moving
    ]),

  ],
  exports: [
    MovingService
  ]
})
export class MovingModule {}
