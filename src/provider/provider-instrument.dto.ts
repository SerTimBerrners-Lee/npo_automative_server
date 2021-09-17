import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { Providers } from "./provider.model";

@Table({tableName: 'provider_instrument', createdAt: false, updatedAt: false})
export class ProvidersInstrument extends Model<ProvidersInstrument> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    providerId: number;    

    @ForeignKey(() => NameInstrument)
    @Column({type: DataType.INTEGER})
    nameInstrumentId: number;

}    