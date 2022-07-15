import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { DocumentsProviders } from 'src/documents/documents-providers.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { Equipment } from 'src/equipment/equipment.model';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { InstrumentModule } from 'src/instrument/instrument.module';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { Inventary } from 'src/inventary/inventary.model';
import { InventaryModule } from 'src/inventary/inventary.module';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { SettingsModule } from 'src/settings/settings.module';
import { DeliveriesEquipments } from './deliveries-equipments.model';
import { DeliveriesInventary } from './deliveries-inventary.model';
import { Deliveries } from './deliveries.model';
import { ProvidersInstrument } from './provider-instrument.dto';
import { ProvidersMaterial } from './provider-material.model';
import { ProviderController } from './provider.controller';
import { Providers } from './provider.model';
import { ProviderService } from './provider.service';
import { ProvidersEquipment } from './providers-equipment.model';
import { Waybill } from './waybill.model';

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
            DeliveriesInventary,
            DeliveriesEquipments,
            PodPodMaterial,
            NameInstrument,
            Equipment,
            Inventary,
            Deliveries,
            Waybill,
            Detal,
            Cbed,
            Metaloworking
        ]),
        DocumentsModule,
        SettingsModule,
        EquipmentModule,
        InstrumentModule,
        forwardRef(() => InventaryModule)
    ],
    exports: [
        ProviderService
    ]
})
export class ProviderModule {}
