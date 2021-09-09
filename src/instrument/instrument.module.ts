import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstrumentController } from './instrument.controller';
import { Instrument } from './instrument.model';
import { InstrumentService } from './instrument.service';
import { NodePtTInstrument } from './node-pt-t-instrument.model';
import { PInstrument } from './pt-instrument.model';

@Module({
    providers: [InstrumentService],
    controllers: [InstrumentController],
    imports: [
        SequelizeModule.forFeature([
            Instrument,
            PInstrument,
            NodePtTInstrument
        ])
    ],
    exports: [
        InstrumentService
    ]
})
export class InstrumentModule {}
