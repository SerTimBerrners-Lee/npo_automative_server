import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, AfterSync } from "sequelize-typescript";
import { TypeEdizm } from "./type-edizm.model";

interface EdizmCreationAttrs {
    name: string;
    short_name: string;
    typeEdizmId: number;
}

@Table({tableName: 'edizm', createdAt: false, updatedAt: false})
export class Edizm extends Model<Edizm, EdizmCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'квадратный миллиметр', description: 'Полная запись единиц измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;    

    @ApiProperty({example: 'мм2', description: 'Кратка запись единиц измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    short_name: string;    


    @ForeignKey(() => TypeEdizm)
    @Column({type: DataType.INTEGER})
    typeEdizmId: number;

    @BelongsTo(() => TypeEdizm)
    author: TypeEdizm

    @AfterSync
    static async checkEdizm(sync: any) {
        const edizm = await sync.sequelize.models.Edizm
        if(!edizm)
            return 

        const allEdizm = await edizm.findAll()
        if(!allEdizm.length) {
            await edizm.create({name: 'штука', short_name: 'шт', typeEdizmId: 8})
            await edizm.create({name: 'литр', short_name: 'л', typeEdizmId: 8})
            await edizm.create({name: 'киллограм', short_name: 'кг', typeEdizmId: 8})
            await edizm.create({name: 'метр', short_name: 'м', typeEdizmId: 8})
            await edizm.create({name: 'м.куб', short_name: 'м.куб', typeEdizmId: 8})
            await edizm.create({name: 'метр', short_name: 'м', typeEdizmId: 7})
            await edizm.create({name: 'миллиметр', short_name: 'мм', typeEdizmId: 7})
            await edizm.create({name: 'киллограмм', short_name: 'кг', typeEdizmId: 4})
            await edizm.create({name: 'день', short_name: 'д', typeEdizmId: 2})
            await edizm.create({name: 'метр.кв', short_name: 'метр.кв', typeEdizmId: 6})
            await edizm.create({name: 'кг/м.куб', short_name: 'кг/м.куб', typeEdizmId: 4})
        }
    }
}    