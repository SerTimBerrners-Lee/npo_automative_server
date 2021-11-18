import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { DocumentsInstrument } from "src/documents/documents-instrument.model";
import { Documents } from "src/documents/documents.model";
import { Equipment } from "src/equipment/equipment.model";
import { DeliveriesInstrument } from "src/provider/deliveries-instrument.model";
import { Deliveries } from "src/provider/deliveries.model";
import { ProvidersInstrument } from "src/provider/provider-instrument.dto";
import { Providers } from "src/provider/provider.model";
import { InstrumentEquipment } from "./instrument-equipment.model";
import { Instrument } from "./instrument.model";
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

    @ApiProperty({example: 12, description: 'Количество материала на складе'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    instrument_kolvo: number; 

    @ApiProperty({example: 12, description: 'Количество материала необходимо'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    shipments_kolvo: number; 

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

    @ApiProperty({example: false, description: 'Выделяет на фоне остальных'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    attention: boolean;

    @BelongsToMany(() => Providers, () => ProvidersInstrument)
    providers: Providers[];

    @ForeignKey(() => PInstrument)
    @Column({type: DataType.INTEGER})
    pInstrumentId: number;

    @BelongsTo(() => PInstrument)
    parent: PInstrument;

    @BelongsToMany(() => Documents, () => DocumentsInstrument)
    documents: Documents[];

    @BelongsToMany(() => Equipment, () => InstrumentEquipment)
    equipments: Equipment[];

    @ForeignKey(() => Instrument)
    @Column({type: DataType.INTEGER})
    rootParentId: number;

    @BelongsTo(() => Instrument)
    instrumentType: Instrument;

    @HasMany(() => Actions)
    actions: Actions[]; 

    @BelongsToMany(() => Deliveries, () => DeliveriesInstrument)
    deliveries: Deliveries[]

}    