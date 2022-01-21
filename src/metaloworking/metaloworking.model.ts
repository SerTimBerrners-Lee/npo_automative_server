import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Detal } from "src/detal/detal.model";
import { StatusMetaloworking } from "src/files/enums";
interface MetaloworkingAttrCreate {
  date_order: string;
  description: string;  
}
@Table({tableName: 'metaloworking'})
export class Metaloworking extends Model<Metaloworking, MetaloworkingAttrCreate> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '', description: ''})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean;

    @ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    date_order: string;

    @ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    number_order: string;
 
    @ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    date_shipments: string;

    @ApiProperty({example: '1', description: ''})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    kolvo_create: number;

    @ApiProperty({example: '1', description: ''})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    kolvo_shipments: number;

		@ApiProperty({example: '', description: ''})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ApiProperty({example: '', description: ''})
    @Column({type: DataType.STRING, defaultValue: StatusMetaloworking.performed})
    status: string;

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detal_id: number;

    @BelongsTo(() => Detal)
    detal: Detal; 
}  