import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Deliveries } from "./deliveries.model";

@Table({tableName: 'deliveries_materials', createdAt: false, updatedAt: false})
export class DeliveriesMaterial extends Model<DeliveriesMaterial> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Deliveries)
    @Column({type: DataType.INTEGER})
    deliveries_id: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    material_id: number;

}    