import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { BuyerCbed } from "src/buyer/buyer-cbed.model";
import { Buyer } from "src/buyer/buyer.model";
import { Detal } from "src/detal/detal.model";
import { TechProcess } from "src/detal/tech-process.model";
import { DocumentsCbed } from "src/documents/documents-cbed.model";
import { Documents } from "src/documents/documents.model";
import { ProductCbed } from "src/product/product-cbed.model";
import { Product } from "src/product/product.model";
import { Sebestoim } from "src/sebestoim/sebestoim.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { ShipmentsCbed } from "src/shipments/shipments-cbed.model";
import { Shipments } from "src/shipments/shipments.model";
import { User } from "src/users/users.model";
import { CbedDetals } from "./cbed-detals.model";
import { CbedMaterial } from "./cbed-material.model";

interface CbedCreationAttrs {
    name: string;
}

@Table({tableName: 'cbed'})
export class Cbed extends Model<Cbed, CbedCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: 12, description: 'Количество Сборочных единиц на складе'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    cbed_kolvo: number; 

    @ApiProperty({example: 12, description: 'Количество СБ необходимо'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    shipments_kolvo: number;

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
    listCbed: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    listDetal: any;

    @BelongsToMany(() => Documents, () => DocumentsCbed)
    documents: Documents[];
    
    @BelongsToMany(() => PodPodMaterial, () => CbedMaterial)
    materials: PodPodMaterial[];

    @BelongsToMany(() => Detal, () => CbedDetals)
    detals: Detal[];

    @HasMany(() => TechProcess)
    techProcesses: TechProcess[];

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => Product, () => ProductCbed)
    products: Product[];

    @HasMany(() => Actions)
    actions: Actions[];

    @HasOne(() => Sebestoim)
    sebestoim: Sebestoim; 

    @BelongsToMany(() => Buyer, () => BuyerCbed)
    buers: Buyer[];

    @BelongsToMany(() => Shipments, () => ShipmentsCbed)
    shipments: Shipments[]; 
}     