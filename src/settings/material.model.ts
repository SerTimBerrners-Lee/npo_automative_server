import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { MatPodMat } from "./mat-pod-mat.model";
import { PodMaterial } from "./pod-material.model";

interface MaterialCreationAttrs {
    name: string; 
}
 
@Table({tableName: 'material'})
export class Material extends Model<Material, MaterialCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'квадратный миллиметр', description: 'Полная запись единиц измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

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

    @ApiProperty({example: 1, description: 'К какой инстанции относится под тип'})
    @Column({type: DataType.STRING, allowNull: false, defaultValue: 1})
    instansMaterial: number;

    @BelongsToMany(() => PodMaterial, () => MatPodMat)
    podMaterials: PodMaterial[];

}    