import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Avatars } from './avatars.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  providers: [AvatarsService],
  controllers: [AvatarsController], 
  imports: [
    SequelizeModule.forFeature([User, Avatars]),
    FilesModule
  ]
})
export class AvatarsModule {}
