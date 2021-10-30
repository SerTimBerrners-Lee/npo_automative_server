
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Product } from "./product.model";

@Table({tableName: 'product_cbed', createdAt: false, updatedAt: false})
export class ProductCbed extends Model<ProductCbed> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    product_id: number;    

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbed_id: number;
}    