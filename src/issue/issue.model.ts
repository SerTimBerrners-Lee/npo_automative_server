import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table,  BelongsToMany, HasMany } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { IssueUser } from "./issue-user.model";

interface IssueCreationAttrs {
    name: string; 
    instans: number;
}

@Table({tableName: 'issue', createdAt: false, updatedAt: false})
export class Issue extends Model<Issue, IssueCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @Column({type: DataType.INTEGER, defaultValue: 1})
    instans: number;

    @BelongsToMany(() => User, () => IssueUser)
    users: User[];

}    