import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_cbed', createdAt: false, updatedAt: false})
export class DocumentsCbed extends Model<DocumentsCbed> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbedId: number;
}   