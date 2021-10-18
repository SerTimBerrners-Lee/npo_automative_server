import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { DocumentsProviders } from "src/documents/documents-providers.model";
import { Documents } from "src/documents/documents.model";
import { Equipment } from "src/equipment/equipment.model";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Deliveries } from "./deliveries.model";
import { ProvidersInstrument } from "./provider-instrument.dto";
import { ProvidersMaterial } from "./provider-material.model";
import { ProvidersEquipment } from "./providers-equipment.model";
interface ProvidersCreationAttrs {
    name: string;
}

@Table({tableName: 'providers', createdAt: false, updatedAt: false})
export class Providers extends Model<Providers, ProvidersCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @Column({type: DataType.STRING, allowNull: true})
    inn: string;

    @Column({type: DataType.STRING, allowNull: true})
    cpp: string;    

    @Column({type: DataType.TEXT, allowNull: true})
    rekvisit: string;

    @Column({type: DataType.TEXT, allowNull: true})
    contacts: string;

    @Column({type: DataType.STRING, allowNull: true})
    description: string;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean;

    @BelongsToMany(() => Documents, () => DocumentsProviders)
    documents: Documents[];

    @BelongsToMany(() => NameInstrument, () => ProvidersInstrument)
    nameInstans: NameInstrument[];

    @BelongsToMany(() => PodPodMaterial, () => ProvidersMaterial)
    materials: PodPodMaterial[];

    @BelongsToMany(() => Equipment, () => ProvidersEquipment)
    equipments: Equipment[];

    @HasMany(() => Actions)
    actions: Actions[];

    @HasMany(() => Deliveries)
    deliveries: Deliveries[];

}    