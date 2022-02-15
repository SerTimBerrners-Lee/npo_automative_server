import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Actions } from 'src/actions/actions.model';
import { DocumentsDetal } from 'src/documents/documents-detal.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { Equipment } from 'src/equipment/equipment.model';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { User } from 'src/users/users.model';
import { DetalController } from './detal.controller';
import { Detal } from './detal.model';
import { DetalService } from './detal.service';
import { OperationEq } from './operation-equipment.model';
import { Operation } from './operation.model';
import { TechProcess } from './tech-process.model';
import { ActionsModule } from 'src/actions/actions.module';
import { TypeOperation } from './type-operation.model';
import { Product } from 'src/product/product.model';
import { Cbed } from 'src/cbed/cbed.model';

@Module({
    controllers: [DetalController],
    providers: [DetalService],
    imports: [
        SequelizeModule.forFeature([
            Detal,
            DocumentsDetal,
            Documents,
            PodPodMaterial,
            Equipment,
            Operation,
            OperationEq,
            NameInstrument,
            TechProcess,
            User,
            Actions,
            TypeOperation,
            Product,
            Cbed
        ]),
        DocumentsModule,
        ActionsModule
    ],
    exports: [
        DetalService
    ]
})
export class DetalModule {}
