import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsDetal } from 'src/documents/documents-detal.model';
import { Documents } from 'src/documents/documents.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { DetalController } from './detal.controller';
import { Detal } from './detal.model';
import { DetalService } from './detal.service';

@Module({
    controllers: [DetalController],
    providers: [DetalService],
    imports: [
        SequelizeModule.forFeature([
            Detal,
            DocumentsDetal,
            Documents,
            PodPodMaterial
        ]),
    ],
    exports: [
        DetalModule
    ]
})
export class DetalModule {}
