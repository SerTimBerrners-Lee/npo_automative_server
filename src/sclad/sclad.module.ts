import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssembleModule } from 'src/assemble/assemble.module';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { DetalModule } from 'src/detal/detal.module';
import { MetaloworkingModule } from 'src/metaloworking/metaloworking.module';
import { Product } from 'src/product/product.model';
import { Providers } from 'src/provider/provider.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { Shipments } from 'src/shipments/shipments.model';
import { Deficit } from './deficit.model';
import { Marks } from './marks.model';
import { ScladController } from './sclad.controller';
import { ScladService } from './sclad.service';
import { WorkingController } from './working.controller';
import { Working } from './working.model';
import { WorkingService } from './working.service';

@Module({
    controllers: [ScladController, WorkingController],
    providers: [ScladService, WorkingService],
    imports: [
        SequelizeModule.forFeature([
            Deficit,
            Marks,
            Detal,
            Cbed,
            Product,
            PodPodMaterial,
            Providers,
            Shipments,
            Working
        ]),
        AssembleModule,
        DetalModule,
        MetaloworkingModule
    ],
    exports: [ScladService]
})
export class ScladModule {}
