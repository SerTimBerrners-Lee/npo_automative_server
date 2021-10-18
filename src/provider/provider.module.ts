import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsProviders } from 'src/documents/documents-providers.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { SettingsModule } from 'src/settings/settings.module';
import { Deliveries } from './deliveries.model';
import { ProvidersInstrument } from './provider-instrument.dto';
import { ProvidersMaterial } from './provider-material.model';
import { ProviderController } from './provider.controller';
import { Providers } from './provider.model';
import { ProviderService } from './provider.service';
import { ProvidersEquipment } from './providers-equipment.model';

@Module({
    providers: [ProviderService],
    controllers: [ProviderController],
    imports: [
        SequelizeModule.forFeature([Providers, 
            Documents, 
            DocumentsProviders,
            ProvidersInstrument,
            ProvidersMaterial,
            ProvidersEquipment,
            PodPodMaterial,
            Deliveries
        ]),
        DocumentsModule,
        SettingsModule
    ],
    exports: [
        ProviderService
    ]
})
export class ProviderModule {}
