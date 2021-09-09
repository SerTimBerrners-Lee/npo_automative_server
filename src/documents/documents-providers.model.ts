import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Providers } from "src/provider/provider.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_providers', createdAt: false, updatedAt: false})
export class DocumentsProviders extends Model<DocumentsProviders> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    providerslId: number;
}   