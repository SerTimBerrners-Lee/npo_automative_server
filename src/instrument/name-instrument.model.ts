import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { DocumentsInstrument } from "src/documents/documents-instrument.model";
import { Documents } from "src/documents/documents.model";
import { Equipment } from "src/equipment/equipment.model";
import { ProvidersInstrument } from "src/provider/provider-instrument.dto";
import { Providers } from "src/provider/provider.model";
import { InstrumentEquipment } from "./instrument-equipment.model";
import { Instrument } from "./instrument.model";
import { NodeNamePtInstrument } from "./node-name-pt-instrument.mode";
import { PInstrument } from "./pt-instrument.model";

interface NameInstrumentCreationAttrs {
    name: string;
}

@Table({tableName: 'name_instrument'})
export class NameInstrument extends Model<NameInstrument, NameInstrumentCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    deliveryTime: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    mountUsed: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    minOstatok: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @BelongsToMany(() => Providers, () => ProvidersInstrument)
    providers: Providers[];

    @BelongsToMany(() => PInstrument, () => NodeNamePtInstrument)
    parents: PInstrument[];

    @BelongsToMany(() => Documents, () => DocumentsInstrument)
    documents: Documents[];

    @BelongsToMany(() => Equipment, () => InstrumentEquipment)
    equipments: Equipment[];

    @ForeignKey(() => Instrument)
    @Column({type: DataType.INTEGER})
    rootParentId: number;

    @BelongsTo(() => Instrument)
    instrumentType: Instrument;

}    