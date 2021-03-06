import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { DocumentsOperation } from "src/documents/dociments-operation.model";
import { Documents } from "src/documents/documents.model";
import { Equipment } from "src/equipment/equipment.model";
import { InstrumentOperation } from "src/instrument/instrument-operation.model";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { Marks } from "src/sclad/marks.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { OperationEq } from "./operation-equipment.model";
import { TechProcess } from "./tech-process.model";
import { TypeOperation } from "./type-operation.model";

interface OperationCreationAttrs {
    name: number;
}

@Table({tableName: 'operation', updatedAt: false})
export class Operation extends Model<Operation, OperationCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '0', description: 'Очередность операций'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    idx: number;

    @ApiProperty({example: 1, description: 'id Тип операции'})
    @Column({type: DataType.INTEGER, allowNull: false})
    name: number; 

    @ApiProperty({example: 'Заготовительная', description: 'Тип операции'})
    @Column({type: DataType.STRING,})
    full_name: string; 

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 
 
    @ApiProperty({example: '1', description: 'Подготовительное время ч'})
    @Column({type: DataType.FLOAT, defaultValue: 0})
    preTime: number;

    @ApiProperty({example: '1', description: 'Вспомогательное время ч'})
    @Column({type: DataType.FLOAT, defaultValue: 0})
    helperTime: number;

    @ApiProperty({example: '1', description: 'Основное время  время ч'})
    @Column({type: DataType.FLOAT, defaultValue: 0})
    mainTime: number; 

    @ApiProperty({example: '1', description: 'Общее число времени время ч'})
    @Column({type: DataType.STRING, defaultValue: ''})
    generalCountTime: string; 

    @ApiProperty({example: '1', description: 'Описание операции'})
    @Column({type: DataType.STRING, defaultValue: ''})
    description: string; 
    
    @BelongsToMany(() => Documents, () => DocumentsOperation)
    documents: Documents[];

    @BelongsToMany(() => Equipment, () => OperationEq)
    equipments: PodPodMaterial[];

    @BelongsToMany(() => NameInstrument, () => InstrumentOperation)
    instruments: NameInstrument[];

    @ApiProperty({example: '1', description: 'Описание операции'})
    @Column({type: DataType.TEXT, defaultValue: ''})
    instrumentList: string; 
    
    @Column({type: DataType.INTEGER, defaultValue: null})
    instrumentID: number;

    @ApiProperty({example: '1', description: 'Описание операции'})
    @Column({type: DataType.TEXT, defaultValue: ''})
    instrumentMerList: string; 

    @Column({type: DataType.INTEGER, defaultValue: null})
    instrumentMerID: number;

    @ApiProperty({example: '1', description: 'Описание операции'})
    @Column({type: DataType.TEXT, defaultValue: ''})
    instrumentOsnList: string; 

    @Column({type: DataType.INTEGER, defaultValue: null})
    instrumentOsnID: number;

    @ApiProperty({example: '1', description: 'Описание операции'})
    @Column({type: DataType.TEXT, defaultValue: ''})
    eqList: string; 

    @Column({type: DataType.INTEGER, defaultValue: null})
    eqID: number;

    @ForeignKey(() => TypeOperation)
    @Column({type: DataType.INTEGER, allowNull: true})
    tOperationId: number;
    
    @BelongsTo(() => TypeOperation)
    typeOperation: TypeOperation;

    @ForeignKey(() => TechProcess)
    @Column({type: DataType.INTEGER})
    tech_process_id: number;
    
    @BelongsTo(() => TechProcess)
    tech_process: TechProcess;

    @HasMany(() => Marks)
    marks: Marks[] 
}     