import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Equipment } from "src/equipment/equipment.model";
import { Documents } from "./documents.model";


@Table({tableName: 'documents_equipment', createdAt: false, updatedAt: false})
export class DocumentsEquipment extends Model<DocumentsEquipment> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ForeignKey(() => Documents)
    @Column({type: DataType.INTEGER})
    documentsId: number;    

    @ForeignKey(() => Equipment)
    @Column({type: DataType.INTEGER})
    equipmentId: number;
}   