import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Assemble } from "./assemble.model";


@Table({tableName: 'assemble_cbed', createdAt: false, updatedAt: false})
export class AssembleCbed extends Model<AssembleCbed> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
		@ForeignKey(() => Assemble)
    @Column({type: DataType.INTEGER})
    assembleId: number;

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbedId: number;    
}   