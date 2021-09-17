import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, BelongsToMany, HasMany } from "sequelize-typescript";
import { DetalMaterials } from "src/detal/detal-materials.model";
import { Detal } from "src/detal/detal.model";
import { DocumentsMaterial } from "src/documents/documents-material.model";
import { Documents } from "src/documents/documents.model";
import { ProvidersMaterial } from "src/provider/provider-material.model";
import { Providers } from "src/provider/provider.model";
import { Edizm } from "./edizm.model";
import { Material } from "./material.model";
import { NodePodPodMaterial } from "./node-pod-pod-material.model";
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
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    deliveryTime: any; 

    @BelongsToMany(() => PodMaterial, () => NodePodPodMaterial)
    materials: PodMaterial[];

    @BelongsToMany(() => Documents, () => DocumentsMaterial)
    documents: Documents[];

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    density: any
 
    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
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
    
    @BelongsToMany(() => Providers, () => ProvidersMaterial)
    providers: Providers[];

    @ForeignKey(() => Material)
    @Column({type: DataType.INTEGER})
    materialsId: number;

    @BelongsTo(() => Material)
    material: Material;

    @BelongsToMany(() => Detal, () => DetalMaterials)
    detals: Detal[];

    // История изменений также прикрепляется сюда при изменении фала 

}    