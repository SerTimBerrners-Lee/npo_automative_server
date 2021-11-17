import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { Deliveries } from "./deliveries.model";

@Table({tableName: 'deliveries_instrument', createdAt: false, updatedAt: false})
export class DeliveriesInstrument extends Model<DeliveriesInstrument> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Deliveries)
    @Column({type: DataType.INTEGER})
    deliveries_id: number;    

    @ForeignKey(() => NameInstrument)
    @Column({type: DataType.INTEGER})
    instrument_id: number;
}    