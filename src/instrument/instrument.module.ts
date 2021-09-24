import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsInstrument } from 'src/documents/documents-instrument.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { ProvidersInstrument } from 'src/provider/provider-instrument.dto';
import { Providers } from 'src/provider/provider.model';
import { InstrumentEquipment } from './instrument-equipment.model';
import { InstrumentController } from './instrument.controller';
import { Instrument } from './instrument.model';
import { InstrumentService } from './instrument.service';
import { NameInstrument } from './name-instrument.model';
import { NodePtTInstrument } from './node-pt-t-instrument.model';
import { PInstrument } from './pt-instrument.model';

@Module({
    providers: [InstrumentService],
    controllers: [InstrumentController],
    imports: [
        SequelizeModule.forFeature([
            Instrument,
            PInstrument,
            NodePtTInstrument,
            NameInstrument,
            Documents,
            DocumentsInstrument,
            ProvidersInstrument,
            Providers,
            InstrumentEquipment
        ]),
        DocumentsModule
    ],
    exports: [
        InstrumentService
    ]
})
export class InstrumentModule {}
