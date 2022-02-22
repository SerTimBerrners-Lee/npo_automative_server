
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Metaloworking } from "src/metaloworking/metaloworking.model";
import { Working } from "./working.model";

@Table({tableName: 'working_metall', createdAt: false, updatedAt: false})
export class WorkingMetall extends Model<WorkingMetall> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Working)
    @Column({type: DataType.INTEGER})
    work_id: number;    

    @ForeignKey(() => Metaloworking)
    @Column({type: DataType.INTEGER})
    metall_id: number;
}    