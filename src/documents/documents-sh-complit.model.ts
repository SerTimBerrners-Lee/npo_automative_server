import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { ShComplit } from "src/shipments/sh-complit.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_sh_complit', createdAt: false, updatedAt: false})
export class DocumentsShComplit extends Model<DocumentsShComplit> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documents_id: number;    

    @ForeignKey(() => ShComplit)
    @Column({type: DataType.INTEGER})
    sh_complit_id: number;
}   