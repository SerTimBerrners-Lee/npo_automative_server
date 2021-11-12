import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Inventary } from "src/inventary/inventary.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_inventary', createdAt: false, updatedAt: false})
export class DocumentsInventary extends Model<DocumentsInventary> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documents_id: number;    

    @ForeignKey(() => Inventary)
    @Column({type: DataType.INTEGER})
    inventary_id: number;
}   