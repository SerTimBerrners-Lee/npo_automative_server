import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, BelongsTo, BelongsToMany, AfterCreate, BeforeCreate} from "sequelize-typescript";
import { AssembleShipments } from "src/assemble/assemble-shipments.model";
import { Assemble } from "src/assemble/assemble.model";
import { Buyer } from "src/buyer/buyer.model";
import { Cbed } from "src/cbed/cbed.model";
import { Detal } from "src/detal/detal.model";
import { statusShipment } from "src/files/enum";
import { MetaloworkingShipments } from "src/metaloworking/metaloworking-shipments.model";
import { Metaloworking } from "src/metaloworking/metaloworking.model";
import { Product } from "src/product/product.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { ShipmentsCbed } from "./shipments-cbed.model";
import { ShipmentsDetal } from "./shipments-detal.model";
import { ShipmentsMaterial } from "./shipments-material.model";

interface ShipmentsAttrCreate {
  readonly number_order: string;
}

@Table({tableName: 'shipments'})
export class Shipments extends Model<Shipments, ShipmentsAttrCreate> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    date_order: string;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    date_shipments: string;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    number_order: string;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.INTEGER})
    kol: number;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.INTEGER})
    day_when_shipments: number;

		@ApiProperty({example: false, description: 'bron'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    bron: boolean;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    base: string;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.BOOLEAN, defaultValue: true})
    to_sklad: boolean;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.TEXT})
    list_cbed_detal: string;

    @ApiProperty({example: '1', description: ''})
    @Column({type: DataType.TEXT})
    list_material: string;

		@ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    description: string;

		@ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;

    @BelongsTo(() =>Product)
    product: Product;

		@ForeignKey(() => Buyer)
    @Column({type: DataType.INTEGER})
    buyerId: number;
    
    @BelongsTo(() =>Buyer)
    buyer: Buyer;

    @ApiProperty({example: '1', description: ''})
    @Column({type: DataType.STRING})
    status: string;
  
    @BelongsToMany(() => Cbed, () => ShipmentsCbed)
    cbeds: Cbed[];

    @BelongsToMany(() => Detal, () => ShipmentsDetal)
    detals: Detal[];

    @BelongsToMany(() => PodPodMaterial, () => ShipmentsMaterial)
    materials: PodPodMaterial[];

    @BelongsToMany(() => Assemble, () => AssembleShipments)
    assemble: Assemble[];

    @BelongsToMany(() => Metaloworking, () => MetaloworkingShipments)
    metaloworking: Metaloworking[];

    @AfterCreate
    static async createShipments(shipments: Shipments) {
      const sh = statusShipment.order
      console.log(sh)
      shipments.status = sh
      await shipments.save()
    }
}  