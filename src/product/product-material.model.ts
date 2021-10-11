
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Product } from "./product.model";

@Table({tableName: 'product_material', createdAt: false, updatedAt: false})
export class ProductMaterial extends Model<ProductMaterial> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    product_id: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    pod_pod_material_id: number;

}    