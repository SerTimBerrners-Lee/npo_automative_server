import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table,  BelongsToMany, HasMany } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { NameInstrument } from "./name-instrument.model";
import { NodePtTInstrument } from "./node-pt-t-instrument.model";
import { PInstrument } from "./pt-instrument.model";

interface InstrumentCreationAttrs {
    name: string; 
    instans: number;
}

@Table({tableName: 'instrument', createdAt: false, updatedAt: false})
export class Instrument extends Model<Instrument, InstrumentCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @Column({type: DataType.INTEGER, defaultValue: 1})
    instans: number;

    @BelongsToMany(() => PInstrument, () => NodePtTInstrument)
    pInstruments: PInstrument[];

    @HasMany(() => NameInstrument)
    nameInstruments: NameInstrument[];

}    