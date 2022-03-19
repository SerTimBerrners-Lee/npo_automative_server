import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Equipment } from "src/equipment/equipment.model";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { Deliveries } from "./deliveries.model";

@Table({tableName: 'deliveries_equipments', createdAt: false, updatedAt: false})
export class DeliveriesEquipments extends Model<DeliveriesEquipments> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Deliveries)
    @Column({type: DataType.INTEGER})
    deliveries_id: number;    

    @ForeignKey(() => Equipment)
    @Column({type: DataType.INTEGER})
    equipment_id: number;
}    