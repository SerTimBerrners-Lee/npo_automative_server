import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { DocumentsInventary } from "src/documents/documents-inventary.model";
import { Documents } from "src/documents/documents.model";
import { DeliveriesInventary } from "src/provider/deliveries-inventary.model";
import { Deliveries } from "src/provider/deliveries.model";
import { Providers } from "src/provider/provider.model";
import { ProvidersInventary } from "src/provider/providers-inventary.model";
import { PTInventary } from "./inventary-pt.model";
import { PInventary } from "./inventary-type.model";


interface AttrCreateInventary {
    readonly name: string;
}

@Table({tableName: 'inventary'})
export class Inventary extends Model<Inventary, AttrCreateInventary> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @ApiProperty({example: 12, description: 'Количество инвентаря на складе'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    inventary_kolvo: number; 

    @ApiProperty({example: 12, description: 'Стоимость'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    price: number; 

    @ApiProperty({example: 12, description: 'Количество инвентаря необходимо'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    shipments_kolvo: number; 

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.INTEGER, allowNull: true})
    delivery_time: number; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.INTEGER, allowNull: true})
    mount_used: number; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.INTEGER, allowNull: true})
    min_ostatok: number; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @ApiProperty({example: false, description: 'Выделяет на фоне остальных'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    attention: boolean;

    @BelongsToMany(() => Providers, () => ProvidersInventary)
    providers: Providers[];

    @ForeignKey(() => PInventary)
    @Column({type: DataType.INTEGER})
    parent_t_id: number;

    @BelongsTo(() => PInventary)
    parent_type: PInventary;

    @BelongsToMany(() => Documents, () => DocumentsInventary)
    documents: Documents[];

    @BelongsToMany(() => Deliveries, () => DeliveriesInventary)
    deliveries: Deliveries[];

    @ForeignKey(() => PTInventary)
    @Column({type: DataType.INTEGER})
    parent_pt_id: number;

    @BelongsTo(() => PTInventary)
    parent_pt: PTInventary;

    @HasMany(() => Actions)
    actions: Actions[]; 

}    