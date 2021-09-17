import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { EquipmentPType } from "./equipment-pt.model";
import { EquipmentType } from "./euipment-type.model";

@Table({tableName: 'node_ptp_equipment', createdAt: false, updatedAt: false})
export class NodePTPEquipment extends Model<NodePTPEquipment> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => EquipmentType)
    @Column({type: DataType.INTEGER})
    equipmentTId: number;    

    @ForeignKey(() => EquipmentPType)
    @Column({type: DataType.INTEGER})
    equipmentPTId: number;

}    