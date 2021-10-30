import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Shipments } from "./shipments.model";


@Table({tableName: 'shipments_material', createdAt: false, updatedAt: false})
export class ShipmentsMaterial extends Model<ShipmentsMaterial> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Shipments)
    @Column({type: DataType.INTEGER})
    shipments_id: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    material_id: number;
}   