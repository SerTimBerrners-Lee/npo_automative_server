import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Equipment } from "src/equipment/equipment.model";
import { Operation } from "./operation.model";


@Table({tableName: 'operation_equipment', createdAt: false, updatedAt: false})
export class OperationEq extends Model<OperationEq> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Operation)
    @Column({type: DataType.INTEGER})
    operationId: number;    

    @ForeignKey(() => Equipment)
    @Column({type: DataType.INTEGER})
    equipmentId: number;
}   