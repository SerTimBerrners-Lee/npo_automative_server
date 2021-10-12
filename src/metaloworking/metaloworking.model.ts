import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo} from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Detal } from "src/detal/detal.model";
import { Shipments } from "src/shipments/shipments.model";
import { MetaloworkingShipments } from "./metaloworking-shipments.model";

interface MetaloworkingAttrCreate {
   date_order: string;
   number_order: string;
   date_shipments: string;
   description: string;
}

@Table({tableName: 'metaloworking'})
export class Metaloworking extends Model<Metaloworking, MetaloworkingAttrCreate> {

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
    @Column({type: DataType.INTEGER})
    kolvo_order_byer: number;

		@ApiProperty({example: '', description: ''})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;
    
    @BelongsToMany(() => Shipments, () => MetaloworkingShipments)
    shipments: Shipments[];

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detal_id: number;

    @BelongsTo(() => Detal)
    detal: Cbed;

}  