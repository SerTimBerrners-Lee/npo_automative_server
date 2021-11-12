import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table,  BelongsToMany, HasMany } from "sequelize-typescript";
import { PTInventary } from "./inventary-pt.model";
import { Inventary } from "./inventary.model";


@Table({tableName: 'p_inventary', createdAt: false, updatedAt: false})
export class PInventary extends Model<PInventary> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @HasMany(() => PTInventary)
    pt_inventary: PTInventary[]

    @HasMany(() => Inventary)
    inventary: Inventary[];
}     