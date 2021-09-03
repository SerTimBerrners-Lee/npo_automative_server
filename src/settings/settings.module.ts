import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Edizm } from './edizm.model';
import { Material } from './material.model';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { TypeEdizm } from './type-edizm.model';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [
    SequelizeModule.forFeature([TypeEdizm, Edizm, Material])
  ],
  exports: [
    SettingsService
  ]
})
export class SettingsModule {}
