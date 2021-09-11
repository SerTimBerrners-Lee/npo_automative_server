import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany } from "sequelize-typescript";
import { EquipmentType } from "./euipment-type.model";
import { NodePTPEquipment } from "./node_tpt_equipment.model";

interface EquipmentPTypeCreationAttrs {
    name: string; 
}

@Table({tableName: 'equipment_pod_type', createdAt: false, updatedAt: false})
export class EquipmentPType extends Model<EquipmentPType, EquipmentPTypeCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @BelongsToMany(() => EquipmentType, () =>  NodePTPEquipment)
    equipmentTypes: EquipmentType[]

}    