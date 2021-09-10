import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsMaterial } from 'src/documents/documents-material.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { DocumentsService } from 'src/documents/documents.service';
import { ProvidersMaterial } from 'src/provider/provider-material.model';
import { Providers } from 'src/provider/provider.model';
import { Edizm } from './edizm.model';
import { MatPodMat } from './mat-pod-mat.model';
import { Material } from './material.model';
import { NodePodPodMaterial } from './node-pod-pod-material.model';
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
      NodePodPodMaterial, DocumentsMaterial, Documents,
      ProvidersMaterial, Providers
    ]),
    DocumentsModule
  ],
  exports: [
    SettingsService
  ]
})
export class SettingsModule {}
