import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { EquipmentPType } from "./equipment-pt.model";
import { Equipment } from "./equipment.model";

@Table({tableName: 'node_eqpt_equipment', createdAt: false, updatedAt: false})
export class NodeEqPTEq extends Model<NodeEqPTEq> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Equipment)
    @Column({type: DataType.INTEGER})
    equipmentsId: number;    

    @ForeignKey(() => EquipmentPType)
    @Column({type: DataType.INTEGER})
    equipmentPTId: number;

}    