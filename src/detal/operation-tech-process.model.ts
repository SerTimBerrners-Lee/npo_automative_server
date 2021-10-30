import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Equipment } from "src/equipment/equipment.model";
import { Operation } from "./operation.model";
import { TechProcess } from "./tech-process.model";


@Table({tableName: 'operation_tech_process', createdAt: false, updatedAt: false})
export class OperationTechProcess extends Model<OperationTechProcess> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Operation)
    @Column({type: DataType.INTEGER})
    operationId: number;    

    @ForeignKey(() => TechProcess)
    @Column({type: DataType.INTEGER})
    techProcessId: number;
}   