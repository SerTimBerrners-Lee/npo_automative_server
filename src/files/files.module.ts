import { Module } from '@nestjs/common';
import { DocumentsModule } from 'src/documents/documents.module';
import { DateMethods } from './date.methods';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService],
  imports: [
    DocumentsModule
  ],
  exports: [
    FilesService
  ]
})
export class FilesModule {}
