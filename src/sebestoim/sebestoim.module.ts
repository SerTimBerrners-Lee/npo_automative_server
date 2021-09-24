import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SebestoimController } from './sebestoim.controller';
import { Sebestoim } from './sebestoim.model';
import { SebestoimService } from './sebestoim.service';

@Module({

    controllers: [SebestoimController],
    providers: [SebestoimService],
    imports: [
        SequelizeModule.forFeature([Sebestoim])
    ],
    exports: [SebestoimModule]
})
export class SebestoimModule {}
