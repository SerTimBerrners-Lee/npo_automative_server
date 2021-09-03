import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import { TypeEdizm } from "./type-edizm.model";

interface EdizmCreationAttrs {
    name: string;
    short_name: string;
    typeEdizmId: number;
}

@Table({tableName: 'edizm', createdAt: false, updatedAt: false})
export class Edizm extends Model<Edizm, EdizmCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'квадратный миллиметр', description: 'Полная запись единиц измерений'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;    

    @ApiProperty({example: 'мм2', description: 'Кратка запись единиц измерений'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    short_name: string;    


    @ForeignKey(() => TypeEdizm)
    @Column({type: DataType.INTEGER})
    typeEdizmId: number;

    @BelongsTo(() => TypeEdizm)
    author: TypeEdizm
}    