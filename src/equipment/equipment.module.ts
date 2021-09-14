import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsEquipment } from 'src/documents/documents-equipment';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { DocumentsService } from 'src/documents/documents.service';
import { InstrumentModule } from 'src/instrument/instrument.module';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { Providers } from 'src/provider/provider.model';
import { ProvidersEquipment } from 'src/provider/providers-equipment.model';
import { EquipmentPType } from './equipment-pt.model';
import { EquipmentController } from './equipment.controller';
import { Equipment } from './equipment.model';
import { EquipmentService } from './equipment.service';
import { EquipmentType } from './euipment-type.model';
import { NodeEqPTEq } from './node-eqpt-eq.model';
import { NodePTPEquipment } from './node_tpt_equipment.model';

@Module({
    controllers: [EquipmentController],
    providers: [EquipmentService],
    imports: [
        SequelizeModule.forFeature([
            EquipmentType,
            EquipmentPType,
            NodePTPEquipment,
            NodeEqPTEq,
            Equipment,
            ProvidersEquipment,
            DocumentsEquipment,
            Documents,
            Providers,
            NameInstrument
        ]),
        DocumentsModule,
        InstrumentModule
    ],
    exports: [
        EquipmentModule
    ]
})
export class EquipmentModule {}
