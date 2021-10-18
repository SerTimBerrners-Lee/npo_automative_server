import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasOne, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { DocumentsDeliveries } from "src/documents/documents-deliveries.model";
import { Documents } from "src/documents/documents.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { DeliveriesMaterial } from "./deliveries-material.model";
import { Providers } from "./provider.model";


interface AttrDeliveriesCreate {
    readonly name: number;
    readonly date_create: string;
}

@Table({tableName: 'deliveries', createdAt: false, updatedAt: false})
export class Deliveries extends Model<Deliveries, AttrDeliveriesCreate> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.INTEGER})
    name: number;   

    @Column({type: DataType.STRING})
    date_create: string;   

    @Column({type: DataType.STRING})
    number_check: string;   // Расчетный счет 

    @Column({type: DataType.INTEGER})
    count: number;   // Сумма

    @Column({type: DataType.STRING})
    date_shipments: string;   // Дата прихода

    @Column({type: DataType.INTEGER})
    nds: number;   // Дата прихода

    @Column({type: DataType.STRING})
    status: string;   

    @Column({type: DataType.TEXT})
    product: any;   // Сами поставки 

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    provider_id: number;
 
    @BelongsTo(() => Providers)
    provider: Providers;

    @BelongsToMany(() => Documents, () => DocumentsDeliveries)
    documents: Documents[]

    @BelongsToMany(() => PodPodMaterial, () => DeliveriesMaterial)
    materials: PodPodMaterial[]
                                    
}    