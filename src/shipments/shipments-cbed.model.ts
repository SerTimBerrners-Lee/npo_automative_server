import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Shipments } from "./shipments.model";


@Table({tableName: 'shipments_cbed', createdAt: false, updatedAt: false})
export class ShipmentsCbed extends Model<ShipmentsCbed> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Shipments)
    @Column({type: DataType.INTEGER})
    shipmentsId: number;    

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbedId: number;
}   