import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { AuthModule } from './auth/auth.module';
import { AvatarsModule } from './avatars/avatars.module';
import { Avatars } from "./avatars/avatars.model";
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { DocumentsModule } from './documents/documents.module';
import { Documents } from "./documents/documents.model";
import { DocumentsUser } from "./documents/documents-user.model";
import { SettingsModule } from './settings/settings.module';
import { DocumentsMaterial } from "./documents/documents-material.model";
import { PodPodMaterial } from "./settings/pod-pod-material.model";
import { PodMaterial } from "./settings/pod-material.model";
import { Edizm } from "./settings/edizm.model";
import { MatPodMat } from "./settings/mat-pod-mat.model";
import { Material } from "./settings/material.model";
import { TypeEdizm } from "./settings/type-edizm.model";
import { ProviderModule } from './provider/provider.module';
import { DocumentsProviders } from "./documents/documents-providers.model";
import { Providers } from "./provider/provider.model";
import { InstrumentModule } from './instrument/instrument.module';
import { Instrument } from "./instrument/instrument.model";
import { PInstrument } from "./instrument/pt-instrument.model";
import { NodePtTInstrument } from "./instrument/node-pt-t-instrument.model";
import { NameInstrument } from "./instrument/name-instrument.model";
import { DocumentsInstrument } from "./documents/documents-instrument.model";
import { ProvidersInstrument } from "./provider/provider-instrument.dto";
import { ProvidersMaterial } from "./provider/provider-material.model";
import { EquipmentModule } from './equipment/equipment.module';
import { EquipmentType } from "./equipment/euipment-type.model";
import { EquipmentPType } from "./equipment/equipment-pt.model";
import { NodePTPEquipment } from "./equipment/node_tpt_equipment.model";
import { Equipment } from "./equipment/equipment.model";
import { ProvidersEquipment } from "./provider/providers-equipment.model";
import { DocumentsEquipment } from "./documents/documents-equipment";
import { InstrumentEquipment } from "./instrument/instrument-equipment.model";
import { DetalModule } from './detal/detal.module';
import { Detal } from "./detal/detal.model";
import { DocumentsDetal } from "./documents/documents-detal.model";
import { DetalMaterials } from "./detal/detal-materials.model";
import { Operation } from "./detal/operation.model";
import { OperationEq } from "./detal/operation-equipment.model";
import { OperationMaterial } from "./detal/operation-material.model";
import { DocumentsOperation } from "./documents/dociments-operation.model";
import { InstrumentOperation } from "./instrument/instrument-operation.model";
import { TechProcess } from "./detal/tech-process.model";
import { DocumentsTechProcess } from "./documents/documents-tech-process.model";
import { OperationTechProcess } from "./detal/operation-tech-process.model";
import { ActionsModule } from './actions/actions.module';
import { Actions } from "./actions/actions.model";
import { TypeOperation } from "./detal/type-operation.model";
import { SebestoimModule } from './sebestoim/sebestoim.module';
import { Sebestoim } from "./sebestoim/sebestoim.model";
import { IssueModule } from './issue/issue.module';
import { IssueUser } from "./issue/issue-user.model";
import { Issue } from "./issue/issue.model";
import { Deliveries } from "./provider/deliveries.model";
import { CbedModule } from './cbed/cbed.module';
import { Cbed } from "./cbed/cbed.model";
import { DocumentsCbed } from "./documents/documents-cbed.model";
import { ProductModule } from './product/product.module';
import { Product } from "./product/product.model";
import { DocumentsProduct } from "./documents/documents-product.model";
import { BuyerModule } from './buyer/buyer.module';
import { Buyer } from "./buyer/buyer.model";
import { Purchases } from "./buyer/purchases.model";
import { DocumentsBuyer } from "./documents/documents-buyer.model";
import { ScladModule } from './sclad/sclad.module';
import { Deficit } from "./sclad/deficit.model";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'dist/static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRESS_HOST,
            port: Number(process.env.POSTGRESS_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [
                User, 
                Role,
                TypeEdizm,
                Avatars, 
                Documents, 
                DocumentsUser,
                DocumentsMaterial,
                DocumentsProviders,
                DocumentsInstrument,
                DocumentsDetal,
                DocumentsOperation,
                DocumentsTechProcess,
                DocumentsCbed,
                DocumentsProduct,
                DocumentsBuyer,
                DocumentsEquipment,
                PodPodMaterial,
                PodMaterial,
                Edizm,
                MatPodMat,
                Material,
                Providers,
                Instrument,
                PInstrument,
                NodePtTInstrument,
                NameInstrument,
                ProvidersInstrument,
                ProvidersMaterial,
                EquipmentType,
                EquipmentPType,
                NodePTPEquipment,
                Equipment,
                ProvidersEquipment,
                InstrumentEquipment,
                Detal,
                DetalMaterials,
                Operation,
                OperationEq,
                OperationMaterial,
                InstrumentOperation,
                TechProcess,
                OperationTechProcess,
                Actions,
                TypeOperation,
                Sebestoim,
                Issue,
                IssueUser,
                Deliveries,
                Cbed,
                Product,
                Buyer,
                Purchases,
                Deficit
            ],
            autoLoadModels: true,
          }),
          
        UsersModule,
        RolesModule,
        AuthModule,
        AvatarsModule,
        FilesModule,
        DocumentsModule,
        SettingsModule,
        ProviderModule,
        InstrumentModule,
        EquipmentModule,
        DetalModule,
        ActionsModule,
        SebestoimModule,
        IssueModule,
        CbedModule,
        ProductModule,
        BuyerModule,
        ScladModule,
    ]
})

export class AppModule {}