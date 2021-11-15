import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Operation } from 'src/detal/operation.model';
import { DocumentsEquipment } from 'src/documents/documents-equipment';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { InstrumentModule } from 'src/instrument/instrument.module';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { Providers } from 'src/provider/provider.model';
import { ProvidersEquipment } from 'src/provider/providers-equipment.model';
import { User } from 'src/users/users.model';
import { EquipmentPType } from './equipment-pt.model';
import { EquipmentController } from './equipment.controller';
import { Equipment } from './equipment.model';
import { EquipmentService } from './equipment.service';
import { EquipmentType } from './euipment-type.model';
import { NodePTPEquipment } from './node_tpt_equipment.model';

@Module({
    controllers: [EquipmentController],
    providers: [EquipmentService],
    imports: [
        SequelizeModule.forFeature([
            EquipmentType,
            EquipmentPType,
            NodePTPEquipment,
            Equipment,
            ProvidersEquipment,
            DocumentsEquipment,
            Documents,
            Providers,
            NameInstrument,
            Operation,
            User
        ]),
        DocumentsModule,
        InstrumentModule
    ],
    exports: [
        EquipmentService
    ]
})
export class EquipmentModule {}
