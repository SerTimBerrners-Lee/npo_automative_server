import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_user', createdAt: false, updatedAt: false})
export class DocumentsUser extends Model<DocumentsUser> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
}   