import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Equipment } from "src/equipment/equipment.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Providers } from "./provider.model";

@Table({tableName: 'provider_equipment', createdAt: false, updatedAt: false})
export class ProvidersEquipment extends Model<ProvidersEquipment> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    providerId: number;    

    @ForeignKey(() => Equipment)
    @Column({type: DataType.INTEGER})
    equipmentsId: number;

}    