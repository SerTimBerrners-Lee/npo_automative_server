import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table,  BelongsToMany, HasMany, ForeignKey } from "sequelize-typescript";
import { DocumentsIssue } from "src/documents/document-issue.model";
import { Documents } from "src/documents/documents.model";
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
    
    @Column({type: DataType.STRING})
    description: string;  
    
    @Column({type: DataType.STRING})
    dateUse: string;  
    
    @Column({type: DataType.STRING})
    normTime: string;  

    @Column({type: DataType.STRING})
    sourse: string;  

    @Column({type: DataType.STRING})
    srok: string;  

    @Column({type: DataType.STRING})
    status: string;  

    @Column({type: DataType.TEXT})
    controllerList: string;  

    @Column({type: DataType.TEXT})
    executorList: string;  

    @Column({type: DataType.TEXT})
    izdList: string;  

    @Column({type: DataType.STRING})
    shopNeeds: string; 

    @Column({type: DataType.INTEGER, defaultValue: 1})
    instans: number;

    @BelongsToMany(() => User, () => IssueUser)
    users: User[];

    @BelongsToMany(() => User, () => IssueUser)
    controllers: User[];

    @BelongsToMany(() => Documents, () => DocumentsIssue)
    documents: Documents[];

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleUserId: number;

}    