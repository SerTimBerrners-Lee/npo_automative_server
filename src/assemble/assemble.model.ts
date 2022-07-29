import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, BelongsTo, BelongsToMany} from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { StatusAssemble } from "src/files/enums";
import { Product } from "src/product/product.model";
import { WorkingAssemble } from "src/sclad/working-assemble.model";
import { Working } from "src/sclad/working.model";

interface AssembleAttrCreate {
  date_order: string;
  description: string;
  type_izd: string;
}
 
@Table({tableName: 'assemble'})
export class Assemble extends Model<Assemble, AssembleAttrCreate> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: '', description: ''})
  @Column({type: DataType.BOOLEAN, defaultValue: false})
  ban: boolean;

  @ApiProperty({example: '1', description: ''})
  @Column({type: DataType.STRING})
  date_order: string;

  @ApiProperty({example: 'prod | cbed', description: 'Сборка или продукция'})
  @Column({type: DataType.STRING})
  type_izd: string;

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
  @Column({type: DataType.STRING})
  description: string;

  @ApiProperty({example: '', description: ''})
  @Column({type: DataType.STRING, defaultValue: StatusAssemble.performed})
  status: string;

  @BelongsToMany(() => Working, () => WorkingAssemble)
  workings: Working[];

  @ForeignKey(() => Cbed)
  @Column({type: DataType.INTEGER})
  cbed_id: number;

  @BelongsTo(() => Cbed)
  cbed: Cbed;

  @ForeignKey(() => Product)
  @Column({type: DataType.INTEGER})
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;
}  