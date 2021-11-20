import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsModule } from 'src/documents/documents.module';
import { ProviderModule } from 'src/provider/provider.module';
import { PTInventary } from './inventary-pt.model';
import { PInventary } from './inventary-type.model';
import { InventaryController } from './inventary.controller';
import { Inventary } from './inventary.model';
import { InventaryService } from './inventary.service';

@Module({
  providers: [InventaryService],
  controllers: [InventaryController],
  imports: [
    SequelizeModule.forFeature([
      PInventary,
      PTInventary,
      Inventary
    ]),
    forwardRef(() => ProviderModule),
    DocumentsModule
  ],
  exports: [
    InventaryService
  ]
})
export class InventaryModule {}
