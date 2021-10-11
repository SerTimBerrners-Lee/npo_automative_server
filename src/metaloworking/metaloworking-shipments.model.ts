import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Shipments } from "src/shipments/shipments.model";
import { Metaloworking } from "./metaloworking.model";


@Table({tableName: 'metaloworking_shipments', createdAt: false, updatedAt: false})
export class MetaloworkingShipments extends Model<MetaloworkingShipments> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
		@ForeignKey(() => Metaloworking)
    @Column({type: DataType.INTEGER})
    metaloworkingId: number;

    @ForeignKey(() => Shipments)
    @Column({type: DataType.INTEGER})
    shipmentsId: number;    
}   