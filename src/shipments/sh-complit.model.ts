import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, BelongsTo, BelongsToMany, HasOne} from "sequelize-typescript";
import { DocumentsShComplit } from "src/documents/documents-sh-complit.model";
import { Documents } from "src/documents/documents.model";
import { Shipments } from "./shipments.model";

interface ShComplitAttrCreate {
  readonly shipments_id: number;
}

@Table({tableName: 'sh_complit'})
export class ShComplit extends Model<ShComplit, ShComplitAttrCreate> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: false, description: 'Архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean;

		@ApiProperty({example: '1', description: 'Дата заказа'})
    @Column({type: DataType.STRING})
    date_order: string;

		@ApiProperty({example: '1', description: 'Дата выполнения'})
    @Column({type: DataType.STRING})
    date_shipments: string;

		@ApiProperty({example: '1', description: 'Номер заказа'})
    @Column({type: DataType.STRING})
    number_order: string;

    @ApiProperty({example: '1', description: 'Заводской номер'})
    @Column({type: DataType.STRING})
    fabric_number: string;

    @ApiProperty({example: '1', description: 'Имя файла основания '})
    @Column({type: DataType.STRING})
    name_check: string;

		@ApiProperty({example: '1', description: 'Название файла основания'})
    @Column({type: DataType.STRING})
    base: string;

		@ApiProperty({example: '1', description: 'Если заказчик склад'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    to_sklad: boolean;

    @ApiProperty({example: '1', description: 'Примечание к заказу'})
    @Column({type: DataType.STRING})
    description: string;

    @HasOne(() => Shipments)
    shipments: Shipments;
    
    @BelongsToMany(() => Documents, () => DocumentsShComplit)
    documents: DocumentsShComplit[];

}  