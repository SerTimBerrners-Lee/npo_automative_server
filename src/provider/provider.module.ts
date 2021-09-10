import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsProviders } from 'src/documents/documents-providers.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { ProvidersInstrument } from './provider-instrument.dto';
import { ProvidersMaterial } from './provider-material.model';
import { ProviderController } from './provider.controller';
import { Providers } from './provider.model';
import { ProviderService } from './provider.service';

@Module({
    providers: [ProviderService],
    controllers: [ProviderController],
    imports: [
        SequelizeModule.forFeature([Providers, 
            Documents, 
            DocumentsProviders,
            ProvidersInstrument,
            ProvidersMaterial
        ]),
        DocumentsModule
    ],
    exports: [
        ProviderService
    ]
})
export class ProviderModule {}
