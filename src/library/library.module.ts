import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter } from './chapter.model';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService],
  imports: [
    SequelizeModule.forFeature([
      Chapter
    ])
  ],
  exports: [
    LibraryService
  ]
})
export class LibraryModule {}
