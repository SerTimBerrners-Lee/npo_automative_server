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
import { Cbed } from "src/cbed/cbed.model";
import { Product } from "src/product/product.model";
import { Buyer } from "src/buyer/buyer.model";
import { DateMethods } from "src/files/date.methods";
import { Inventary } from "src/inventary/inventary.model";
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

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbedId: number;

    @BelongsTo(() => Cbed)
    cbed: Cbed;

    @ForeignKey(() => TechProcess)
    @Column({type: DataType.INTEGER})
    techProcessId: number;

    @BelongsTo(() => TechProcess)
    techProcess: TechProcess;

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

    @ForeignKey(() => Inventary)
    @Column({type: DataType.INTEGER})
    inventary_id: number;

    @BelongsTo(() => Inventary)
    inventary: Buyer;



    @BeforeCreate
    static addDateTime(action: Actions) {

        const dateMethods   = new DateMethods

        const date          = dateMethods.date()
        const hours         = dateMethods.hours
        const minute        = dateMethods.minute
        const seconds       = dateMethods.seconds

        action.dateTime = `${date} ${hours}:${minute}:${seconds}`

        
    }
}