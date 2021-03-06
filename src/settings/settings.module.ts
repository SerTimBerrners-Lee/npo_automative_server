import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Operation } from 'src/detal/operation.model';
import { DocumentsMaterial } from 'src/documents/documents-material.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { Deliveries } from 'src/provider/deliveries.model';
import { ProvidersMaterial } from 'src/provider/provider-material.model';
import { Providers } from 'src/provider/provider.model';
import { Edizm } from './edizm.model';
import { Inaction } from './inaction.model';
import { MatPodMat } from './mat-pod-mat.model';
import { Material } from './material.model';
import { NormHors } from './normhors.model';
import { PodMaterial } from './pod-material.model';
import { PodPodMaterial } from './pod-pod-material.model';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { TypeEdizm } from './type-edizm.model';
 
@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [
    SequelizeModule.forFeature([
      TypeEdizm, Edizm, 
      Material, PodMaterial, 
      MatPodMat, PodPodMaterial,
      DocumentsMaterial, Documents,
      ProvidersMaterial, Providers,
      Operation, Deliveries,
      NormHors, Inaction
    ]),
    DocumentsModule, 
    FilesModule
  ],
  exports: [
    SettingsService
  ]
})
export class SettingsModule {}
