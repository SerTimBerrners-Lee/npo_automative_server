import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Shipments } from "src/shipments/shipments.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_shipments', createdAt: false, updatedAt: false})
export class DocumentsShipments extends Model<DocumentsShipments> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documents_id: number;    

    @ForeignKey(() => Shipments)
    @Column({type: DataType.INTEGER})
    shipments_id: number;
}   