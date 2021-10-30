
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Detal } from "src/detal/detal.model";
import { Product } from "./product.model";

@Table({tableName: 'product_detal', createdAt: false, updatedAt: false})
export class ProductDetal extends Model<ProductDetal> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    product_id: number;    

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detal_id: number;
}    