import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Detal } from "src/detal/detal.model";
import { Operation } from "src/detal/operation.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_operation', createdAt: false, updatedAt: false})
export class DocumentsOperation extends Model<DocumentsOperation> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Operation)
    @Column({type: DataType.INTEGER})
    operationId: number;
}   