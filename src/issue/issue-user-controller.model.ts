import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Issue } from "./issue.model";


@Table({tableName: 'issue_user_controller', createdAt: false, updatedAt: false})
export class IssueUserController extends Model<IssueUserController> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Issue)
    @Column({type: DataType.INTEGER})
    issueId: number;    

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
}   