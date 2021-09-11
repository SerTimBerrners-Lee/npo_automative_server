import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany } from "sequelize-typescript";
import { EquipmentPType } from "./equipment-pt.model";
import { NodePTPEquipment } from "./node_tpt_equipment.model";

interface EquipmentTypeCreationAttrs {
    name: string; 
}

@Table({tableName: 'equipment_type', createdAt: false, updatedAt: false})
export class EquipmentType extends Model<EquipmentType, EquipmentTypeCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @BelongsToMany(() => EquipmentPType, () => NodePTPEquipment)
    equipmentsPT: EquipmentPType[]
}    
