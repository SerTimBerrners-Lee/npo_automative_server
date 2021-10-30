import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Issue } from "src/issue/issue.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_issue', createdAt: false, updatedAt: false})
export class DocumentsIssue extends Model<DocumentsIssue> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Issue)
    @Column({type: DataType.INTEGER})
    issueId: number;
}   