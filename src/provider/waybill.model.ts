import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { DocumentsWaybill } from "src/documents/documents-waybill.model";
import { Documents } from "src/documents/documents.model";
import { Providers } from "./provider.model";

interface WatbillCreateAttr {
  readonly name: string;
  readonly type_сoming: string;
}

@Table({tableName: 'waylbill'})
export class Waybill extends Model<Waybill, WatbillCreateAttr> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING})
    name: string;

    @Column({type: DataType.TEXT})
    product: any;

    @Column({type: DataType.STRING})
    description: string;

    @Column({type: DataType.STRING})
    type_сoming: string;

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    provider_id: number;
 
    @BelongsTo(() => Providers)
    provider: Providers;

    @BelongsToMany(() => Documents, () => DocumentsWaybill)
    documents: Documents[]
                                    
}    