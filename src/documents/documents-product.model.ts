import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Product } from "src/product/product.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_product', createdAt: false, updatedAt: false})
export class DocumentsProduct extends Model<DocumentsProduct> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;
}   