import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Waybill } from "src/provider/waybill.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_waybill', createdAt: false, updatedAt: false})
export class DocumentsWaybill extends Model<DocumentsWaybill> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documents_id: number;    

    @ForeignKey(() => Waybill)
    @Column({type: DataType.INTEGER})
    waybils_id: number;
}   