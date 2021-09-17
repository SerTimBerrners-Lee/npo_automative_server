import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { NameInstrument } from "src/instrument/name-instrument.model";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_instrument', createdAt: false, updatedAt: false})
export class DocumentsInstrument extends Model<DocumentsInstrument> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => NameInstrument)
    @Column({type: DataType.INTEGER})
    instrumentId: number;
}   