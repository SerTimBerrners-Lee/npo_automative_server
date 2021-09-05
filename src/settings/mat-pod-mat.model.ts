
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Material } from "./material.model";
import { PodMaterial } from "./pod-material.model";

@Table({tableName: 'mat_podmat', createdAt: false, updatedAt: false})
export class MatPodMat extends Model<MatPodMat> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Material)
    @Column({type: DataType.INTEGER})
    matId: number;    

    @ForeignKey(() => PodMaterial)
    @Column({type: DataType.INTEGER})
    podMatId: number;

}    