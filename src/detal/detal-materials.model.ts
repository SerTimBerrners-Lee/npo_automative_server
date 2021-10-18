import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Detal } from "./detal.model";


@Table({tableName: 'detal_materials', createdAt: false, updatedAt: false})
export class DetalMaterials extends Model<DetalMaterials> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detalsId: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    materialsId: number;
}   