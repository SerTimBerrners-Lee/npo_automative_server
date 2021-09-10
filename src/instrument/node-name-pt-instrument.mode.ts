import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { NameInstrument } from "./name-instrument.model";
import { PInstrument } from "./pt-instrument.model";

@Table({tableName: 'node_name_pt_instrument', createdAt: false, updatedAt: false})
export class NodeNamePtInstrument extends Model<NodeNamePtInstrument> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => PInstrument)
    @Column({type: DataType.INTEGER})
    pInstrumentId: number;    

    @ForeignKey(() => NameInstrument)
    @Column({type: DataType.INTEGER})
    nameInstrumentId: number;

}    