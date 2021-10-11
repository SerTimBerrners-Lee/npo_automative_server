import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Detal } from "src/detal/detal.model";
import { Metaloworking } from "./metaloworking.model";


@Table({tableName: 'metaloworking_detal', createdAt: false, updatedAt: false})
export class MetaloworkingDetal extends Model<MetaloworkingDetal> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
		@ForeignKey(() => Metaloworking)
    @Column({type: DataType.INTEGER})
    metaloworkingId: number;

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detalId: number;    
}   