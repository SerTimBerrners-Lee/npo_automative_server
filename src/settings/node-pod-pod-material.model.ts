
import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodMaterial } from "./pod-material.model";
import { PodPodMaterial } from "./pod-pod-material.model";

@Table({tableName: 'node_pod_podmat', createdAt: false, updatedAt: false})
export class NodePodPodMaterial extends Model<NodePodPodMaterial> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => PodMaterial)
    @Column({type: DataType.INTEGER})
    podMatId: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    podPodMatId: number;

}    