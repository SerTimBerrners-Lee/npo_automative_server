import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Links } from "./links.model";


@Table({tableName: 'links_user', createdAt: false, updatedAt: false})
export class LinksUser extends Model<LinksUser> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Links)
    @Column({type: DataType.INTEGER})
    links_id: number;    

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    user_id: number;
}   