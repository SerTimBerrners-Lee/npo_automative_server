import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { PodPodMaterial } from "src/settings/pod-pod-material.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_material', createdAt: false, updatedAt: false})
export class DocumentsMaterial extends Model<DocumentsMaterial> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => PodPodMaterial)
    @Column({type: DataType.INTEGER})
    materialId: number;
}   