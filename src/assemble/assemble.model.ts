import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo} from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Operation } from "src/detal/operation.model";
import { TechProcess } from "src/detal/tech-process.model";
import { Shipments } from "src/shipments/shipments.model";
import { AssembleShipments } from "./assemble-shipments.model";

interface AssembleAttrCreate {
  date_order: string;
  number_order: string;
  date_shipments: string; 
  description: string;
}

enum StatusAssemble {
  start = 'В процессе',
  end = 'Готово',
  expired = 'Просрочено' 
}
 
@Table({tableName: 'assemble'})
export class Assemble extends Model<Assemble, AssembleAttrCreate> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

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
  @Column({type: DataType.INTEGER})
  kolvo_all: number;

  @ApiProperty({example: '1', description: ''})
  @Column({type: DataType.INTEGER, defaultValue: 0})
  kolvo_create: number;

  @ApiProperty({example: '1', description: ''})
  @Column({type: DataType.INTEGER})
  kolvo_order_byer: number;

  @ApiProperty({example: '', description: ''})
  @Column({type: DataType.STRING})
  description: string;

  @ApiProperty({example: '', description: ''})
  @Column({type: DataType.STRING, defaultValue: StatusAssemble.start})
  status: string;

  @ForeignKey(() => Operation)
  @Column({type: DataType.INTEGER})
  operation_id: number;

  @BelongsTo(() => Operation)
  operation: Operation;
  
  @BelongsToMany(() => Shipments, () => AssembleShipments)
  shipments: Shipments[];

  @ForeignKey(() => Cbed)
  @Column({type: DataType.INTEGER})
  cbed_id: number;

  @BelongsTo(() => Cbed)
  cbed: Cbed;

  @ForeignKey(() => TechProcess)
  @Column({type: DataType.INTEGER})
  tp_id: number;

  @BelongsTo(() => TechProcess)
  tech_process: TechProcess;
}  