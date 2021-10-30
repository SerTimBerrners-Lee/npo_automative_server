import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasOne } from "sequelize-typescript";
import { Buyer } from "./buyer.model";
interface PurchasesCreationAttrs {
    name: string;
}

@Table({tableName: 'purchases', createdAt: false, updatedAt: false})
export class Purchases extends Model<Purchases, PurchasesCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    orderNumber: string;   // Номер заказа

    @Column({type: DataType.STRING, allowNull: false})
    name: string;   // Наименование изделия 

    @Column({type: DataType.STRING, allowNull: false})
    dateStart: string;   // Дата заказа

    @Column({type: DataType.STRING, allowNull: false})
    count: string;   // количество штук

    @Column({type: DataType.STRING, allowNull: false})
    base: string; // Основание   

    @Column({type: DataType.STRING, allowNull: false})
    dateEnd: string;   // Дата отгрузки

    @Column({type: DataType.STRING, allowNull: false})
    description: any;   // Примечание

    @Column({type: DataType.STRING, allowNull: false})
    status: string;   

    @HasOne(() => Buyer)
    buyer: Buyer;
                                    
}    