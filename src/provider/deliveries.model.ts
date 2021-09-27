import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasOne } from "sequelize-typescript";
import { Providers } from "./provider.model";
interface DeliveriesCreationAttrs {
    name: string;
}

@Table({tableName: 'deliveries', createdAt: false, updatedAt: false})
export class Deliveries extends Model<Deliveries, DeliveriesCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @Column({type: DataType.STRING, allowNull: false})
    checkinAccount: string;   // Расчетный счет 

    @Column({type: DataType.STRING, allowNull: false})
    count: string;   // Сумма

    @Column({type: DataType.STRING, allowNull: false})
    dateEnd: string;   // Дата прихода

    @Column({type: DataType.STRING, allowNull: false})
    status: string;   

    @Column({type: DataType.TEXT, allowNull: false})
    product: any;   // Сами поставки 

    @HasOne(() => Providers)
    provider: Providers;
                                    
}    