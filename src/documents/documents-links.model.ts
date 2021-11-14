import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Links } from "src/library/links.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_links', createdAt: false, updatedAt: false})
export class DocumentsLinks extends Model<DocumentsLinks> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documents_id: number;    

    @ForeignKey(() => Links)
    @Column({type: DataType.INTEGER})
    links_id: number;
}   