import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasMany } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface RoleCreationAttrs {
    value: string;
    description: string;
}

@Table({tableName: 'roles', createdAt: false, updatedAt: false})
export class Role extends Model<Role, RoleCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'ADMIN', description: 'Значение роли пользователя'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;    

    @ApiProperty({example: 'Директор', description: 'Описание роли пользователя '})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @HasMany(() => User)
    user: User[];
}    