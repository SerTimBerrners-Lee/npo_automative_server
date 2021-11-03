import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssembleModule } from 'src/assemble/assemble.module';
import { DetalModule } from 'src/detal/detal.module';
import { Metaloworking } from 'src/metaloworking/metaloworking.model';
import { MetaloworkingModule } from 'src/metaloworking/metaloworking.module';
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
            Marks
        ]),
        AssembleModule,
        DetalModule,
        MetaloworkingModule
    ],
    exports: [ScladService]
})
export class ScladModule {}
