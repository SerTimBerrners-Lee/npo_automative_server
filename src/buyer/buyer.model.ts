import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { Cbed } from "src/cbed/cbed.model";
import { DocumentsBuyer } from "src/documents/documents-buyer.model";
import { Documents } from "src/documents/documents.model";
import { Shipments } from "src/shipments/shipments.model";
import { BuyerCbed } from "./buyer-cbed.model";
import { Purchases } from "./purchases.model";
interface BuyerCreationAttrs {
    name: string;
}

@Table({tableName: 'buyer'})
export class Buyer extends Model<Buyer, BuyerCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number; 

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean;

    @Column({type: DataType.STRING, allowNull: true})
    inn: string;

    @Column({type: DataType.STRING, allowNull: true})
    cpp: string;    

    @Column({type: DataType.TEXT, allowNull: true})
    rekvisit: string;

    @Column({type: DataType.TEXT, allowNull: true})
    contacts: string;

    @Column({type: DataType.STRING, allowNull: true})
    description: string;

    @ApiProperty({example: false, description: 'Выделяет на фоне остальных'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    attention: boolean;

    @BelongsToMany(() => Documents, () => DocumentsBuyer)
    documents: Documents[];

    @HasMany(() => Actions)
    actions: Actions[];

    @ForeignKey(() => Purchases)
    @Column({type: DataType.INTEGER})
    purchasesId: number;

    @BelongsTo(() => Purchases)
    purchases: Purchases;

    @BelongsToMany(() => Cbed, () => BuyerCbed)
    cbeds: Cbed[];

    @HasMany(() => Shipments)
    shipments: Shipments[];

}    