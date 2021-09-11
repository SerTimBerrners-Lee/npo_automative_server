import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EquipmentPType } from './equipment-pt.model';
import { EquipmentController } from './equipment.controller';
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
            NodePTPEquipment
        ])
    ],
    exports: [
        EquipmentModule
    ]
})
export class EquipmentModule {}
