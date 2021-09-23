import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { DocumentsDetal } from "src/documents/documents-detal.model";
import { Documents } from "src/documents/documents.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { User } from "src/users/users.model";
import { DetalMaterials } from "./detal-materials.model";
import { TechProcess } from "./tech-process.model";

interface DetalCreationAttrs {
    name: string;
}

@Table({tableName: 'detal'})
export class Detal extends Model<Detal, DetalCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: true, description: 'Добавляем в архив'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    articl: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    parametrs: any; 

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    haracteriatic: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    DxL: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    massZag: any;
    
    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.STRING, allowNull: true})
    trash: any;

    @ApiProperty({example: 12, description: 'Срок поставки'})
    @Column({type: DataType.TEXT, allowNull: true})
    materialList: any;

    @BelongsToMany(() => Documents, () => DocumentsDetal)
    documents: Documents[];

    // Регистрируем модель для материалов
    @BelongsToMany(() => PodPodMaterial, () => DetalMaterials)
    materials: PodPodMaterial[];

    @Column({type: DataType.INTEGER, allowNull: true})
    mat_zag: number;
    @Column({type: DataType.INTEGER, allowNull: true})
    mat_zag_zam: number;

    @HasMany(() => TechProcess)
    techProcesses: TechProcess[];

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Actions)
    actions: Actions[];
}     