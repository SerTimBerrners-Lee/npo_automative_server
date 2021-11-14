import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsModule } from 'src/documents/documents.module';
import { Chapter } from './chapter.model';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Links } from './links.model';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService],
  imports: [
    SequelizeModule.forFeature([
      Chapter,
      Links
    ]),
    DocumentsModule
  ],
  exports: [
    LibraryService
  ]
})
export class LibraryModule {}
