import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Operation } from "./operation.model";


@Table({tableName: 'operation_material', createdAt: false, updatedAt: false})
export class OperationMaterial extends Model<OperationMaterial> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Operation)
    @Column({type: DataType.INTEGER})
    operationId: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    materialId: number;
}   