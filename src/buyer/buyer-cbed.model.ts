
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Buyer } from "./buyer.model";

@Table({tableName: 'buyer_cbed', createdAt: false, updatedAt: false})
export class BuyerCbed extends Model<BuyerCbed> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbed_id: number;    

    @ForeignKey(() => Buyer)
    @Column({type: DataType.INTEGER})
    buyer_id: number;

}    