import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, BelongsToMany, HasMany, BeforeFind, AfterFind, AfterValidate } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { CbedMaterial } from "src/cbed/cbed-material.model";
import { Cbed } from "src/cbed/cbed.model";
import { DetalMaterials } from "src/detal/detal-materials.model";
import { Detal } from "src/detal/detal.model";
import { OperationMaterial } from "src/detal/operation-material.model";
import { Operation } from "src/detal/operation.model";
import { DocumentsMaterial } from "src/documents/documents-material.model";
import { Documents } from "src/documents/documents.model";
import { EZ_KOLVO, TYPE_EZ } from "src/files/enums";
import { ProductMaterial } from "src/product/product-material.model";
import { Product } from "src/product/product.model";
import { DeliveriesMaterial } from "src/provider/deliveries-material.model";
import { Deliveries } from "src/provider/deliveries.model";
import { ProvidersMaterial } from "src/provider/provider-material.model";
import { Providers } from "src/provider/provider.model";
import { Material } from "./material.model";
import { PodMaterial } from "./pod-material.model";
interface PodPodMaterialCreationAttrs {
    name: string;
} 

@Table({tableName: 'pod_pod_material'})
export class PodPodMaterial extends Model<PodPodMaterial, PodPodMaterialCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING})
    name: string;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: 12, description: 'Количество материала на складе'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    material_kolvo: number; 

    @ApiProperty({example: 12, description: 'Минимальное количество'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    min_remaining: number; 

    @ApiProperty({example: 12, description: 'Заказаное количесвто'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    deliveries_kolvo: number; 

    @ApiProperty({example: 12, description: 'Количество материала необходимо'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    shipments_kolvo: number; 
 
    @ApiProperty({example: 12, description: 'Количество материала необходимо'})
    @Column({type: DataType.TEXT, defaultValue: EZ_KOLVO})
    ez_kolvo: any; 
    
    @ApiProperty({example: 12, description: 'Стоимость'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    price: number; 

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Срок поставки'})
    @Column({type: DataType.STRING})
    deliveryTime: any; 

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    density: any
 
    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Срок поставки'})
    @Column({type: DataType.TEXT, defaultValue: TYPE_EZ})
    kolvo: any; 

    @ApiProperty({example: 'материал железо', description: 'Описание материала'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    length: any;    

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    width: any;    
 
    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    height: any;   

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    wallThickness: any;   

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    outsideDiametr: any; 
    
    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    thickness: any;   

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    areaCrossSectional: any;   

    @ApiProperty({example: false, description: 'Выделяет на фоне остальных'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    attention: boolean;
    
    @BelongsToMany(() => Providers, () => ProvidersMaterial)
    providers: Providers[];

    @ForeignKey(() => Material)
    @Column({type: DataType.INTEGER})
    materialsId: number;

    @BelongsTo(() => Material)
    material: Material;

    @ForeignKey(() => PodMaterial)
    @Column({type: DataType.INTEGER})
    podMaterialId: number;

    @BelongsTo(() => PodMaterial)
    podMaterial: PodMaterial;

    @BelongsToMany(() => Detal, () => DetalMaterials)
    detals: Detal[];

    @BelongsToMany(() => Operation, () => OperationMaterial)
    operation: Operation[]

    @HasMany(() => Actions)
    actions: Actions[];

    @BelongsToMany(() => Cbed, () => CbedMaterial)
    cbeds: Cbed[];

    @BelongsToMany(() => Product, () => ProductMaterial)
    products: Product[];

    @BelongsToMany(() => Deliveries, () => DeliveriesMaterial)
    deliveries: Deliveries[]

    @BelongsToMany(() => Documents, () => DocumentsMaterial)
    documents: Documents[];
}    