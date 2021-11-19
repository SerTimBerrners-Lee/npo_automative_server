import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Inventary } from "src/inventary/inventary.model";
import { Deliveries } from "./deliveries.model";

@Table({tableName: 'deliveries_inventary', createdAt: false, updatedAt: false})
export class DeliveriesInventary extends Model<DeliveriesInventary> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Deliveries)
    @Column({type: DataType.INTEGER})
    deliveries_id: number;    

    @ForeignKey(() => Inventary)
    @Column({type: DataType.INTEGER})
    inventary_id: number;
}    