import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasMany, ForeignKey, BelongsToMany, BelongsTo, } from "sequelize-typescript";
import { DocumentsMoving } from "src/documents/documents-moving.model";
import { Documents } from "src/documents/documents.model";
import { User } from "src/users/users.model";

interface MovingCreationAttrs {
  name: string;
}
 
@Table({tableName: 'product'})
export class Moving extends Model<Moving, MovingCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '', description: 'Коллекция перемещенных продуктов'})
    @Column({type: DataType.TEXT})
    arr_product: string;   

    @ApiProperty({example: 12, description: 'Описание'})
    @Column({type: DataType.STRING})
    description: string;

    @ApiProperty({example: 12, description: 'Описание'})
    @Column({type: DataType.STRING})
    cause: string;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.BOOLEAN})
    to_sklad: boolean;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.BOOLEAN})
    from_sklad: boolean;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    to_user: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    from_user: number;

    @BelongsTo(() => User)
    users: User[]

    @BelongsToMany(() => Documents, () => DocumentsMoving)
    documents: Documents[];
}     