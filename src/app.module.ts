import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { UserRoles } from "./roles/user-roles.model";
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
import { NodePodPodMaterial } from "./settings/node-pod-pod-material.model";
import { PodMaterial } from "./settings/pod-material.model";
import { Edizm } from "./settings/edizm.model";
import { MatPodMat } from "./settings/mat-pod-mat.model";
import { Material } from "./settings/material.model";
import { TypeEdizm } from "./settings/type-edizm.model";
import { ProviderModule } from './provider/provider.module';
import { DocumentsProviders } from "./documents/documents-providers.model";
import { Providers } from "./provider/provider.model";
import { InstrumentController } from './instrument/instrument.controller';
import { InstrumentService } from './instrument/instrument.service';
import { InstrumentModule } from './instrument/instrument.module';
import { Instrument } from "./instrument/instrument.model";
import { PInstrument } from "./instrument/pt-instrument.model";
import { NodePtTInstrument } from "./instrument/node-pt-t-instrument.model";
import { NameInstrument } from "./instrument/name-instrument.model";
import { NodeNamePtInstrument } from "./instrument/node-name-pt-instrument.mode";
import { DocumentsInstrument } from "./documents/documents-instrument.model";
import { ProvidersInstrument } from "./provider/provider-instrument.dto";
import { ProvidersMaterial } from "./provider/provider-material.model";

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
                UserRoles, 
                Avatars, 
                Documents, 
                DocumentsUser,
                DocumentsMaterial,
                PodPodMaterial,
                NodePodPodMaterial,
                PodMaterial,
                Edizm,
                MatPodMat,
                Material,
                TypeEdizm,
                DocumentsProviders,
                Providers,
                Instrument,
                PInstrument,
                NodePtTInstrument,
                NameInstrument,
                NodeNamePtInstrument,
                DocumentsInstrument,
                ProvidersInstrument,
                ProvidersMaterial
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
    ]
})

export class AppModule {}