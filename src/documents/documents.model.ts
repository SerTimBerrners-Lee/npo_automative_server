import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { DocumentsUser } from "./documents-user.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { DocumentsMaterial } from "./documents-material.model";
import { DocumentsProviders } from "./documents-providers.model";
import { Providers } from "src/provider/provider.model";
import { Equipment } from "src/equipment/equipment.model";
import { DocumentsEquipment } from "./documents-equipment";
import { Detal } from "src/detal/detal.model";
import { DocumentsDetal } from "./documents-detal.model";
import { Actions } from "src/actions/actions.model";
import { Issue } from "src/issue/issue.model";
import { DocumentsIssue } from "./document-issue.model";
import { Deliveries } from "src/provider/deliveries.model";
import { DocumentsDeliveries } from "./documents-deliveries.model";
import { Product } from "src/product/product.model";
import { DocumentsProduct } from "./documents-product.model";
import { Cbed } from "src/cbed/cbed.model";
import { DocumentsCbed } from "./documents-cbed.model";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { DocumentsInstrument } from "./documents-instrument.model";
import { Inventary } from "src/inventary/inventary.model";
import { DocumentsInventary } from "./documents-inventary.model";
import { Buyer } from "src/buyer/buyer.model";
import { DocumentsBuyer } from "./documents-buyer.model";
import { Shipments } from "src/shipments/shipments.model";
import { DocumentsShipments } from "./documents-shipments.mode";

interface DocumentsCreationAttrs {
    name: string; 
    path: string
}

@Table({tableName: 'documents'})
export class Documents extends Model<Documents, DocumentsCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'filename.doc', description: 'Название файла'})
    @Column({type: DataType.STRING, allowNull: false})
    name : string; 
 
    @ApiProperty({example: '32e3rewwdad.doc', description: 'Сгенерированный путь '})
    @Column({type: DataType.STRING, allowNull: false})
    path : string; 

    @ApiProperty({example: 'ЧЖ', description: 'Чертижи'})
    @Column({type: DataType.STRING, allowNull: true})
    type: string; 

    @ApiProperty({example: 'p', description: 'Принадлежит к таблице пользователей'})
    @Column({type: DataType.STRING, allowNull: true})
    nameInstans : string;  

    @ApiProperty({example: 'Что-то', description: 'Описание'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string; 

    @ApiProperty({example: 1, description: 'Версия документа'})
    @Column({type: DataType.INTEGER, defaultValue: 1})
    version: number; 

    @ApiProperty({example: 'false', description: 'Архивация файла'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'false', description: 'Аватар'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ava: boolean;

    @BelongsToMany(() => User, () => DocumentsUser)
    users: User[];

    @BelongsToMany(() => PodPodMaterial, () => DocumentsMaterial)
    materials: PodPodMaterial[];

    @BelongsToMany(() => Providers, () => DocumentsProviders)
    providers: Providers[];

    @BelongsToMany(() => Equipment, () => DocumentsEquipment)
    equipments: Equipment[];

    @BelongsToMany(() => NameInstrument, () => DocumentsInstrument)
    instrument: NameInstrument[];

    @BelongsToMany(() => Inventary, () => DocumentsInventary)
    inventary: Inventary[];

    @BelongsToMany(() => Detal, () => DocumentsDetal)
    detals: Detal[]

    @BelongsToMany(() => Buyer, () => DocumentsBuyer)
    buyers: Buyer[]

    @BelongsToMany(() => Product, () => DocumentsProduct)
    products: Product[];

    @BelongsToMany(() => Cbed, () => DocumentsCbed)
    cbeds: Cbed[];

    @HasMany(() => Actions)
    actions: Actions[];

    @BelongsToMany(() => Issue, () => DocumentsIssue)
    issues: Issue[];

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsible_user_id: number;
 
    @BelongsTo(() => User)
    responible_user: User;

    @BelongsToMany(() => Deliveries, () => DocumentsDeliveries)
    deliveries: Deliveries[]

    @BelongsToMany(() => Shipments, () => DocumentsShipments)
    shipments: Shipments[]
} 