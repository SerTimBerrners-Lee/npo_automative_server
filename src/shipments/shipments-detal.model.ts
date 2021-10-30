import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Detal } from "src/detal/detal.model";
import { Shipments } from "./shipments.model";


@Table({tableName: 'shipments_detal', createdAt: false, updatedAt: false})
export class ShipmentsDetal extends Model<ShipmentsDetal> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Shipments)
    @Column({type: DataType.INTEGER})
    shipmentsId: number;    

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detalId: number;
}   