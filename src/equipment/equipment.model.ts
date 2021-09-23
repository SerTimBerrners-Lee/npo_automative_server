import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { OperationEq } from "src/detal/operation-equipment.model";
import { Operation } from "src/detal/operation.model";
import { DocumentsEquipment } from "src/documents/documents-equipment";
import { DocumentsInstrument } from "src/documents/documents-instrument.model";
import { Documents } from "src/documents/documents.model";
import { InstrumentEquipment } from "src/instrument/instrument-equipment.model";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { ProvidersInstrument } from "src/provider/provider-instrument.dto";
import { Providers } from "src/provider/provider.model";
import { ProvidersEquipment } from "src/provider/providers-equipment.model";
import { User } from "src/users/users.model";
import { EquipmentPType } from "./equipment-pt.model";
import { EquipmentType } from "./euipment-type.model";
import { NodeEqPTEq } from "./node-eqpt-eq.model";

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

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    deliveryTime: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    invNymber: string;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 
 
    @BelongsToMany(() => Providers, () => ProvidersEquipment)
    providers: Providers[];

    @BelongsToMany(() => EquipmentPType, () => NodeEqPTEq)
    parents: EquipmentPType[];

    @BelongsToMany(() => Documents, () => DocumentsEquipment)
    documents: Documents[];

    @BelongsToMany(() => NameInstrument, () => InstrumentEquipment)
    nameInstrument: NameInstrument[]

    @ForeignKey(() => EquipmentType)
    @Column({type: DataType.INTEGER})
    rootParentId: number;

    @BelongsTo(() => EquipmentType)
    equipmentType: EquipmentType;

    @BelongsToMany(() => Operation, () => OperationEq)
    operation: Operation[]

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Actions)
    actions: Actions[];

}     