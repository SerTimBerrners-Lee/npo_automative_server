
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Detal } from "src/detal/detal.model";
import { Cbed } from "./cbed.model";

@Table({tableName: 'cbed_detals', createdAt: false, updatedAt: false})
export class CbedDetals extends Model<CbedDetals> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbed_id: number;    

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detal_is: number;

}    