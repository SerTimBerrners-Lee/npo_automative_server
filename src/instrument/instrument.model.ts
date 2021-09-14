import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table,  BelongsToMany, HasMany } from "sequelize-typescript";
import { NameInstrument } from "./name-instrument.model";
import { NodePtTInstrument } from "./node-pt-t-instrument.model";
import { PInstrument } from "./pt-instrument.model";

interface InstrumentCreationAttrs {
    name: string; 
}

@Table({tableName: 'instrument', createdAt: false, updatedAt: false})
export class Instrument extends Model<Instrument, InstrumentCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @BelongsToMany(() => PInstrument, () => NodePtTInstrument)
    pInstruments: PInstrument[];

    @HasMany(() => NameInstrument)
    nameInstruments: NameInstrument[];

}    