
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Cbed } from "./cbed.model";

@Table({tableName: 'cbed_material', createdAt: false, updatedAt: false})
export class CbedMaterial extends Model<CbedMaterial> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbed_id: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    pod_pod_material_id: number;

}    