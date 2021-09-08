import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, BelongsToMany, HasMany } from "sequelize-typescript";
import { MatPodMat } from "./mat-pod-mat.model";
import { Material } from "./material.model";
import { NodePodPodMaterial } from "./node-pod-pod-material.model";
import { PodPodMaterial } from "./pod-pod-material.model";

interface PodMaterialCreationAttrs {
    name: string;
}

@Table({tableName: 'pod_material'})
export class PodMaterial extends Model<PodMaterial, PodMaterialCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @ApiProperty({example: '{edizmId: 10, znach: 2}', description: 'Запись значений'})
    @Column({type: DataType.STRING, allowNull: true})
    density: any; 

    @BelongsToMany(() => PodPodMaterial, () => NodePodPodMaterial)
    podPodMaterials: PodPodMaterial[];

    @BelongsToMany(() => Material, () => MatPodMat)
    materials: Material[];

}    