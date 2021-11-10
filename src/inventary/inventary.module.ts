import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PTInventary } from './inventary-pt.model';
import { PInventary } from './inventary-type.model';
import { InventaryController } from './inventary.controller';
import { InventaryService } from './inventary.service';

@Module({
  providers: [InventaryService],
  controllers: [InventaryController],
  imports: [
    SequelizeModule.forFeature([
      PInventary,
      PTInventary
    ]),
  ],
  exports: [
    InventaryService
  ]
})
export class InventaryModule {}
