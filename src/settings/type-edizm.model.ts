import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasMany } from "sequelize-typescript";
import { Edizm } from "./edizm.model";

interface TypeEdizmCreationAttrs {
    name: string;
}

@Table({tableName: 'type_edizm', createdAt: false, updatedAt: false})
export class TypeEdizm extends Model<TypeEdizm, TypeEdizmCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Единицы площади', description: 'Запись типа единиц измерений'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;    

    @HasMany(() => Edizm)
    edizm: Edizm[];
}    