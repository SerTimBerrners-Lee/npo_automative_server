import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Deliveries } from "src/provider/deliveries.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_deliveries', createdAt: false, updatedAt: false})
export class DocumentsDeliveries extends Model<DocumentsDeliveries> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documents_id: number;    

    @ForeignKey(() => Deliveries)
    @Column({type: DataType.INTEGER})
    deliveries_id: number;
}   