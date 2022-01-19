import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Detal } from 'src/detal/detal.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { Product } from 'src/product/product.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { User } from 'src/users/users.model';
import { CbedController } from './cbed.controller';
import { Cbed } from './cbed.model';
import { CbedService } from './cbed.service';

@Module({
    controllers: [CbedController],
    providers: [CbedService],
    imports: [
        SequelizeModule.forFeature([
            Cbed,
            User,
            Documents,
            TechProcess,
            PodPodMaterial,
            Detal,
            Product
        ]),
        DocumentsModule
    ],
    exports: [
        CbedService
    ]
})
export class CbedModule {}
