import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Inventary } from "src/inventary/inventary.model";
import { Providers } from "./provider.model";

@Table({tableName: 'provider_inventary', createdAt: false, updatedAt: false})
export class ProvidersInventary extends Model<ProvidersInventary> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    provider_id: number;    

    @ForeignKey(() => Inventary)
    @Column({type: DataType.INTEGER})
    inventary_id: number;

}    