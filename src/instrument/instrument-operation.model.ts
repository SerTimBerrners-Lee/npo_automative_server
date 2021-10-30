import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Operation } from "src/detal/operation.model";
import { Equipment } from "src/equipment/equipment.model";
import { NameInstrument } from "./name-instrument.model";

@Table({tableName: 'instrument_operation', createdAt: false, updatedAt: false})
export class InstrumentOperation extends Model<InstrumentOperation> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => NameInstrument)
    @Column({type: DataType.INTEGER})
    nInstrumentId: number;    

    @ForeignKey(() => Operation)
    @Column({type: DataType.INTEGER})
    operatoinId: number;

}    