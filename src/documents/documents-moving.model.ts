import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Moving } from "src/moving/moving.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_moving', createdAt: false, updatedAt: false})
export class DocumentsMoving extends Model<DocumentsMoving> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documents_id: number;    

    @ForeignKey(() => Moving)
    @Column({type: DataType.INTEGER})
    moving_id: number;
}   