import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Providers } from "./provider.model";

@Table({tableName: 'provider_material', createdAt: false, updatedAt: false})
export class ProvidersMaterial extends Model<ProvidersMaterial> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    providerId: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    podPodMaterialId: number;

}    