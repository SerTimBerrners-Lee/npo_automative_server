import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { Cbed } from "src/cbed/cbed.model";
import { DocumentsTechProcess } from "src/documents/documents-tech-process.model";
import { Documents } from "src/documents/documents.model";
import { Product } from "src/product/product.model";
import { Detal } from "./detal.model";
import { Operation } from "./operation.model";

@Table({tableName: 'tech_process'})
export class TechProcess extends Model<TechProcess> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Заготовительная', description: 'Тип операции'})
    @Column({type: DataType.INTEGER, allowNull: true})
    name: number;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: '1', description: 'Описание операции'})
    @Column({type: DataType.STRING, defaultValue: ''})
    description: string; 
    
    @BelongsToMany(() => Documents, () => DocumentsTechProcess)
    documents: Documents[];

    @HasMany(() => Operation)
    operations: Operation[];

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detalId: number;

    @BelongsTo(() => Detal)
    detal: Detal;

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbedId: number;

    @BelongsTo(() => Cbed)
    cbed: Cbed;

    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;

    @BelongsTo(() => Product)
    product: Product;
}     