
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Instrument } from "./instrument.model";
import { PInstrument } from "./pt-instrument.model";

@Table({tableName: 'node_pt_t_instrument', createdAt: false, updatedAt: false})
export class NodePtTInstrument extends Model<NodePtTInstrument> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Instrument)
    @Column({type: DataType.INTEGER})
    instrumentId: number;    

    @ForeignKey(() => PInstrument)
    @Column({type: DataType.INTEGER})
    pInstrumentId: number;

}    