import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface AvatarsCreationAttrs {
    title: string;
    content: string;
    userId: number;
    image: string;
}

@Table({tableName: 'avatars'})
export class Avatars extends Model<Avatars, AvatarsCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Название записи', description: 'Заголовок'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    title: string;      
    @ApiProperty({example: '12345678', description: 'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    content: string;

    // Храним изображение 
    @Column({type: DataType.STRING})
    image: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    author: User;

}  