import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Shipments } from "src/shipments/shipments.model";
import { Assemble } from "./assemble.model";


@Table({tableName: 'assemble_shipments', createdAt: false, updatedAt: false})
export class AssembleShipments extends Model<AssembleShipments> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
		@ForeignKey(() => Assemble)
    @Column({type: DataType.INTEGER})
    assembleId: number;

    @ForeignKey(() => Shipments)
    @Column({type: DataType.INTEGER})
    shipmentsId: number;    
}   