import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { CbedDetals } from "src/cbed/cbed-detals.model";
import { Cbed } from "src/cbed/cbed.model";
import { DocumentsDetal } from "src/documents/documents-detal.model";
import { Documents } from "src/documents/documents.model";
import { ProductDetal } from "src/product/product-detal.model";
import { Product } from "src/product/product.model";
import { Sebestoim } from "src/sebestoim/sebestoim.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { ShipmentsDetal } from "src/shipments/shipments-detal.model";
import { Shipments } from "src/shipments/shipments.model";
import { User } from "src/users/users.model";
import { DetalMaterials } from "./detal-materials.model";
import { TechProcess } from "./tech-process.model";

interface DetalCreationAttrs {
    name: string;
}

@Table({tableName: 'detal'})
export class Detal extends Model<Detal, DetalCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: 12, description: 'Количество Деталей на складе'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    detal_kolvo: number; 

    @ApiProperty({example: 12, description: 'Количество деталей необходимо'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    shipments_kolvo: number;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    articl: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @ApiProperty({example: 12, description: 'Параметры - норма времени на изготовление'})
    @Column({type: DataType.TEXT, allowNull: true})
    parametrs: any; 

    @ApiProperty({example: 12, description: 'Характеристики детали'})
    @Column({type: DataType.TEXT, allowNull: true})
    haracteriatic: any;

    @ApiProperty({example: 12, description: 'Параметры заготовки'})
    @Column({type: DataType.STRING, allowNull: true})
    DxL: any;

    @ApiProperty({example: 12, description: 'Масса заготовки'})
    @Column({type: DataType.STRING, allowNull: true})
    massZag: any;
    
    @ApiProperty({example: 12, description: 'Отходы'})
    @Column({type: DataType.STRING, allowNull: true})
    trash: any;

    @ApiProperty({example: 12, description: 'Лист материалов'})
    @Column({type: DataType.TEXT, allowNull: true})
    materialList: any;

    @BelongsToMany(() => Documents, () => DocumentsDetal)
    documents: Documents[];

    // Регистрируем модель для материалов
    @BelongsToMany(() => PodPodMaterial, () => DetalMaterials)
    materials: PodPodMaterial[];

    @Column({type: DataType.INTEGER, allowNull: true})
    mat_zag: number;
    @Column({type: DataType.INTEGER, allowNull: true})
    mat_zag_zam: number;

    @HasMany(() => TechProcess)
    techProcesses: TechProcess[];

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => Cbed, () => CbedDetals)
    cbed: Cbed[];

    @BelongsToMany(() => Product, () => ProductDetal)
    products: Product[];

    @HasMany(() => Actions)
    actions: Actions[];

    @HasOne(() => Sebestoim)
    sebestoim: Sebestoim;

    @BelongsToMany(() => Shipments, () => ShipmentsDetal)
    shipments: Shipments[];
}     