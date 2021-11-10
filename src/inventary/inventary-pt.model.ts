import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { PInventary } from "./inventary-type.model";

interface AttrCreatePTInventary {
    readonly name: string;
    readonly inventary_type_id: string;
}

@Table({tableName: 'pt_inventary', createdAt: false, updatedAt: false})
export class PTInventary extends Model<PTInventary, AttrCreatePTInventary> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @ForeignKey(() => PInventary)
    @Column({type: DataType.INTEGER})
    inventary_type_id: number;

    @BelongsTo(() => PInventary)
    parent: PInventary;

}     