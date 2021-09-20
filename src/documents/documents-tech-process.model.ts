import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { TechProcess } from "src/detal/tech-process.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_tech_process', createdAt: false, updatedAt: false})
export class DocumentsTechProcess extends Model<DocumentsTechProcess> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => TechProcess)
    @Column({type: DataType.INTEGER})
    techProcessId: number;
}   