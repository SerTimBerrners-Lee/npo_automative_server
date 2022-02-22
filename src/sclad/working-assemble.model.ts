
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Assemble } from "src/assemble/assemble.model";
import { Working } from "./working.model";

@Table({tableName: 'working_assemble', createdAt: false, updatedAt: false})
export class WorkingAssemble extends Model<WorkingAssemble> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Working)
    @Column({type: DataType.INTEGER})
    work_id: number;    

    @ForeignKey(() => Assemble)
    @Column({type: DataType.INTEGER})
    ass_id: number;
}    