import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Equipment } from "src/equipment/equipment.model";
import { NameInstrument } from "./name-instrument.model";

@Table({tableName: 'instrument_equipment', createdAt: false, updatedAt: false})
export class InstrumentEquipment extends Model<InstrumentEquipment> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => NameInstrument)
    @Column({type: DataType.INTEGER})
    nInstrumentId: number;    

    @ForeignKey(() => Equipment)
    @Column({type: DataType.INTEGER})
    equipmentId: number;

}    