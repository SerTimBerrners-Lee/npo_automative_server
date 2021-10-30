import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Buyer } from "src/buyer/buyer.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_buyer', createdAt: false, updatedAt: false})
export class DocumentsBuyer extends Model<DocumentsBuyer> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Buyer)
    @Column({type: DataType.INTEGER})
    buyerId: number;
}   