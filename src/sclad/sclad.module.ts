import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssembleModule } from 'src/assemble/assemble.module';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { DetalModule } from 'src/detal/detal.module';
import { MetaloworkingModule } from 'src/metaloworking/metaloworking.module';
import { Product } from 'src/product/product.model';
import { Deficit } from './deficit.model';
import { Marks } from './marks.model';
import { ScladController } from './sclad.controller';
import { ScladService } from './sclad.service';

@Module({
    controllers: [ScladController],
    providers: [ScladService],
    imports: [
        SequelizeModule.forFeature([
            Deficit,
            Marks,
            Detal,
            Cbed,
            Product
        ]),
        AssembleModule,
        DetalModule,
        MetaloworkingModule
    ],
    exports: [ScladService]
})
export class ScladModule {}
