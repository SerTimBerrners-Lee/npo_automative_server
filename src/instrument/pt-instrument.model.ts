import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table,  BelongsToMany } from "sequelize-typescript";
import { Instrument } from "./instrument.model";
import { NameInstrument } from "./name-instrument.model";
import { NodeNamePtInstrument } from "./node-name-pt-instrument.mode";
import { NodePtTInstrument } from "./node-pt-t-instrument.model";

interface PInstrumentCreationAttrs {
    name: string; 
}

@Table({tableName: 'p_instrument', createdAt: false, updatedAt: false})
export class PInstrument extends Model<PInstrument, PInstrumentCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @BelongsToMany(() => Instrument, () => NodePtTInstrument)
    instruments: Instrument[];

    @BelongsToMany(() => NameInstrument, () => NodeNamePtInstrument)
    nameInstrument: NameInstrument[];
}    