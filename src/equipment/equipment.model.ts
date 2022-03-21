import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { OperationEq } from "src/detal/operation-equipment.model";
import { Operation } from "src/detal/operation.model";
import { DocumentsEquipment } from "src/documents/documents-equipment";
import { Documents } from "src/documents/documents.model";
import { InstrumentEquipment } from "src/instrument/instrument-equipment.model";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { DeliveriesEquipments } from "src/provider/deliveries-equipments.model";
import { Deliveries } from "src/provider/deliveries.model";
import { Providers } from "src/provider/provider.model";
import { ProvidersEquipment } from "src/provider/providers-equipment.model";
import { User } from "src/users/users.model";
import { EquipmentPType } from "./equipment-pt.model";
import { EquipmentType } from "./euipment-type.model";
interface EquipmentCreationAttrs {
    name: string;
}

@Table({tableName: 'equipment'})
export class Equipment extends Model<Equipment, EquipmentCreationAttrs> {

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
    equipment_kolvo: number; 

    @ApiProperty({example: 12, description: 'Стоимость'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    price: number; 

    @ApiProperty({example: 12, description: 'Количество материала необходимо'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    shipments_kolvo: number; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    deliveryTime: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    invNymber: string;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @ApiProperty({example: false, description: 'Выделяет на фоне остальных'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    attention: boolean;
 
    @BelongsToMany(() => Providers, () => ProvidersEquipment)
    providers: Providers[];

    //Привязываем к подтипу 
    @ForeignKey(() => EquipmentPType)
    @Column({type: DataType.INTEGER})
    equipmentPTypeId: number;

    @BelongsTo(() => EquipmentPType)
    equipmentPType: EquipmentPType;

    @BelongsToMany(() => Documents, () => DocumentsEquipment)
    documents: Documents[];

    @BelongsToMany(() => NameInstrument, () => InstrumentEquipment)
    nameInstrument: NameInstrument[]

    @ForeignKey(() => EquipmentType)
    @Column({type: DataType.INTEGER})
    rootParentId: number;

    //  Привязка к типу
    @BelongsTo(() => EquipmentType) 
    equipmentType: EquipmentType;    

    @BelongsToMany(() => Operation, () => OperationEq)
    operation: Operation[];

    @BelongsToMany(() => Deliveries, () => DeliveriesEquipments)
    deliveries: Deliveries[];

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Actions)
    actions: Actions[];

}     