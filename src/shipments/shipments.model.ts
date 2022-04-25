import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, BelongsTo, BelongsToMany, HasMany, BeforeFind, AfterFind} from "sequelize-typescript";
import { Buyer } from "src/buyer/buyer.model";
import { Cbed } from "src/cbed/cbed.model";
import { Detal } from "src/detal/detal.model";
import { DocumentsShipments } from "src/documents/documents-shipments.mode";
import { Documents } from "src/documents/documents.model";
import { DateMethods } from "src/files/date.methods";
import { statusShipment } from "src/files/enums";
import { logs } from "src/files/logs";
import { Product } from "src/product/product.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { ShComplit } from "./sh-complit.model";
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

    @ApiProperty({example: false, description: 'Архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean;

		@ApiProperty({example: '1', description: 'Дата заказа'})
    @Column({type: DataType.STRING})
    date_order: string;

		@ApiProperty({example: '1', description: 'Дата отгрузки покупателю'})
    @Column({type: DataType.STRING})
    date_shipments: string;

		@ApiProperty({example: '1', description: 'Номер заказа'})
    @Column({type: DataType.STRING})
    number_order: string;

		@ApiProperty({example: '1', description: 'Количеяство продукции'})
    @Column({type: DataType.INTEGER})
    kol: number;

		@ApiProperty({example: false, description: 'bron'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    bron: boolean;

		@ApiProperty({example: '1', description: 'Название файла основания'})
    @Column({type: DataType.STRING})
    base: string;

		@ApiProperty({example: '1', description: 'Если заказчик склад'})
    @Column({type: DataType.BOOLEAN, defaultValue: true})
    to_sklad: boolean;
    
		@ApiProperty({example: '1', description: 'Список сборок и деталей'})
    @Column({type: DataType.TEXT,  defaultValue: '[]'})
    list_cbed_detal: string;

    @ApiProperty({example: '1', description: 'Список сборок и деталей входящих в основные сборки'})
    @Column({type: DataType.TEXT, defaultValue: '[]'})
    list_hidden_cbed_detal: string;

		@ApiProperty({example: '1', description: 'Примечание к заказу'})
    @Column({type: DataType.STRING})
    description: string;

		@ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;

    @BelongsTo(() => Product)
    product: Product;

		@ForeignKey(() => Buyer)
    @Column({type: DataType.INTEGER})
    buyerId: number;
    
    @BelongsTo(() => Buyer)
    buyer: Buyer;

    @ApiProperty({example: '1', description: 'Статус заказа'})
    @Column({type: DataType.STRING, defaultValue: statusShipment.order})
    status: string;

    @ForeignKey(() => Shipments)
    @Column({type: DataType.INTEGER})
    parent_id: number;

    @HasMany(() => Shipments)
    childrens: Shipments[];
  
    @BelongsToMany(() => Cbed, () => ShipmentsCbed)
    cbeds: Cbed[];

    @BelongsToMany(() => Detal, () => ShipmentsDetal)
    detals: Detal[];

    @BelongsToMany(() => PodPodMaterial, () => ShipmentsMaterial)
    materials: PodPodMaterial[];

    @BelongsToMany(() => Documents, () => DocumentsShipments)
    documents: DocumentsShipments[];

    @ForeignKey(() => ShComplit)
    @Column({type: DataType.INTEGER})
    sh_complit_id: number;
    
    @BelongsTo(() => ShComplit)
    sh_complit: ShComplit;

    @AfterFind
    static async checkOverbye(shipment: Array<Shipments>) {
      // Если просрочено по времени - меняем статус при условии что задача не удалена
      const dt = new DateMethods();
      
      if(!shipment?.length) return;
      for(const item of shipment) {
        if (item.sh_complit_id) {
          item.status = statusShipment.order;
          await item.save();
        }

        if (
            !item.ban // Если не в бане 
            && dt.dateDifference(undefined, item.date_shipments) < 1 // Просрочено 
          ) {

          if (item.status == statusShipment.overbue) continue; // Статус просрочено уже есть 
          if (item.status != statusShipment.done && item.status) {
            logs('Измененный заказ', 'Предыдуший статус', item.status, 'id заказа', item.id);
            item.status = statusShipment.overbue;
            await item.save();
          }; // Статус Отгружено - пропускаем
        }
      }
  }
}  