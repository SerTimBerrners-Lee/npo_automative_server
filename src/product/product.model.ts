import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { Assemble } from "src/assemble/assemble.model";
import { Cbed } from "src/cbed/cbed.model";
import { Detal } from "src/detal/detal.model";
import { TechProcess } from "src/detal/tech-process.model";
import { DocumentsProduct } from "src/documents/documents-product.model";
import { Documents } from "src/documents/documents.model";
import { Sebestoim } from "src/sebestoim/sebestoim.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Shipments } from "src/shipments/shipments.model";
import { User } from "src/users/users.model";
import { ProductCbed } from "./product-cbed.model";
import { ProductDetal } from "./product-detal.model";
import { ProductMaterial } from "./product-material.model";

interface ProductCreationAttrs {
    name: string;
}
 
@Table({tableName: 'product'})
export class Product extends Model<Product, ProductCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
 
    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: 12, description: 'Количество Продукции на складе'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    product_kolvo: number; 

    @ApiProperty({example: 12, description: 'Количество Продукции Заказано'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    shipments_kolvo: number;
 
    @ApiProperty({example: 1, description: 'Количество Заказаных на Изделие'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    assemble_kolvo: number; 

    @ApiProperty({example: 12, description: 'Минимальное количество продукции'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    min_remaining: number;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    fabricNumber: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    articl: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    parametrs: any; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    haracteriatic: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    materialList: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    listPokDet: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    listDetal: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    listCbed: any;

    @ApiProperty({example: false, description: 'Выделяет на фоне остальных'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    attention: boolean;
    
    @BelongsToMany(() => Documents, () => DocumentsProduct)
    documents: Documents[];

    @BelongsToMany(() => PodPodMaterial, () => ProductMaterial)
    materials: PodPodMaterial[];

    @BelongsToMany(() => Detal, () => ProductDetal)
    detals: Detal[];

    @BelongsToMany(() => Cbed, () => ProductCbed)
    cbeds: Cbed[]; 

    @HasOne(() => TechProcess) 
    techProcesses: TechProcess;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Actions)
    actions: Actions[];

    @HasOne(() => Sebestoim)
    sebestoim: Sebestoim;

    @HasMany(() => Shipments)
    shipments: Shipments[];

    @HasMany(() => Assemble)
    assemble: Assemble[];
}     