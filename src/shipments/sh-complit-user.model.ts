import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { ShComplit } from "./sh-complit.model";

@Table({tableName: 'sh_complit_users', createdAt: false, updatedAt: false})
export class ShComplitUsers extends Model<ShComplitUsers> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => ShComplit)
    @Column({type: DataType.INTEGER})
    sh_complit_id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    user_id: number;
}   