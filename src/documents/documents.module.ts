import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Providers } from 'src/provider/provider.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { DocumentsInstrument } from './documents-instrument.model';
import { DocumentsMaterial } from './documents-material.model';
import { DocumentsProviders } from './documents-providers.model';
import { DocumentsUser } from './documents-user.model';
import { DocumentsController } from './documents.controller';
import { Documents } from './documents.model';
import { DocumentsService } from './documents.service';

@Module({
    providers: [DocumentsService],
    controllers: [DocumentsController],
    imports: [
        SequelizeModule.forFeature([Documents, 
            User, 
            DocumentsUser, 
            DocumentsMaterial, 
            PodPodMaterial, 
            Providers, 
            DocumentsProviders,
            DocumentsInstrument
        ]),
        forwardRef(() => UsersModule),
        
    ],
    exports: [
        DocumentsService
    ]
})
export class DocumentsModule {}
