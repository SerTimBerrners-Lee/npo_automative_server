import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasMany } from "sequelize-typescript";
import { Operation } from "./operation.model";

interface TypeOperationCreationAttrs {
    name: string;
    preTime: boolean;
    helperTime: boolean;
    mainTime: boolean;
}

@Table({tableName: 'type_operation', createdAt: false, updatedAt: false})
export class TypeOperation extends Model<TypeOperation, TypeOperationCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Заготовительная', description: 'Тип операции'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: '1', description: 'Подготовительное время ч'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    preTime: boolean;

    @ApiProperty({example: '1', description: 'Вспомогательное время ч'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    helperTime: boolean;

    @ApiProperty({example: '1', description: 'Основное время  время ч'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    mainTime: boolean; 

    @HasMany(() => Operation)
    operations: Operation[];
}     