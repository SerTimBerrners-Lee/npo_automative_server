import { Model, Column, DataType, Table, ForeignKey, BelongsTo, BeforeCreate } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { Equipment } from "src/equipment/equipment.model";
import { Providers } from "src/provider/provider.model";
import { Documents } from "src/documents/documents.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { Detal } from "src/detal/detal.model";
import { TechProcess } from "src/detal/tech-process.model";
interface ActionsCreationAttrs { 
    action: string
}

@Table({tableName: 'actions', createdAt: false, updatedAt: false})
export class Actions extends Model<Actions, ActionsCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '12.12.2021 01:12:22', description: 'Дата и время '})
    @Column({type: DataType.STRING, allowNull: true})
    dateTime : string; 
 
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsibleId: number;

    @BelongsTo(() => User)
    user: User;

    @ApiProperty({example: 'Создал таблицу', description: 'Описание действия пользователя'})
    @Column({type: DataType.TEXT, allowNull: false})
    action : string;

    @ForeignKey(() => Equipment)
    @Column({type: DataType.INTEGER})
    equipmentId: number;

    @BelongsTo(() => Equipment)
    equipment: Equipment;

    @ForeignKey(() => Providers)
    @Column({type: DataType.INTEGER})
    providerId: number;

    @BelongsTo(() => Providers)
    provider: Providers;

    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentId: number;

    @BelongsTo(() => Documents)
    document: Documents;

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    podPodMaterialId: number;

    @BelongsTo(() => PodPodMaterial)
    podPodMaterial: PodPodMaterial;

    @ForeignKey(() => NameInstrument)
    @Column({type: DataType.INTEGER})
    nameInstrumentId: number;

    @BelongsTo(() => NameInstrument)
    nameInstrument: NameInstrument;

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detalId: number;

    @BelongsTo(() => Detal)
    detal: Detal;

    @ForeignKey(() => TechProcess)
    @Column({type: DataType.INTEGER})
    techProcessId: number;

    @BelongsTo(() => TechProcess)
    techProcess: TechProcess;



    @BeforeCreate
    static addDateTime(action: Actions) {
        const dt = new Date()
        const date = dt.toISOString()
                        .slice(0,10)
                        .split('-')
                        .reverse()
                        .join('.')
        const hours = dt.getUTCHours() + 3
        const minute = dt.getMinutes().toString().length == 1 ? '0' + dt.getMinutes() : dt.getMinutes()
        const seconds = dt.getSeconds().toString().length == 1 ? '0' + dt.getSeconds() : dt.getSeconds()

        action.dateTime = `${date} ${hours}:${minute}:${seconds}`

        
    }
}