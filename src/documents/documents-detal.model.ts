import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Detal } from "src/detal/detal.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_detal', createdAt: false, updatedAt: false})
export class DocumentsDetal extends Model<DocumentsDetal> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detalId: number;
}   