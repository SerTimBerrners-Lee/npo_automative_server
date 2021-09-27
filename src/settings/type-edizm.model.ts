import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasMany, AfterSync, BeforeSync, AfterDefine } from "sequelize-typescript";
import { Edizm } from "./edizm.model";

interface TypeEdizmCreationAttrs {
    name: string;
}

@Table({tableName: 'type_edizm', createdAt: false, updatedAt: false})
export class TypeEdizm extends Model<TypeEdizm, TypeEdizmCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Единицы площади', description: 'Запись типа единиц измерений'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;    

    @HasMany(() => Edizm)
    edizm: Edizm[];

    @AfterSync
    static async checkTypeEdizm(sync: any) {
        //  Получаем все типы если их нет - создаем
        const typeEdizm = await sync.sequelize.models.TypeEdizm
        if(!typeEdizm)
            return 

        const allTypeEdizm = await typeEdizm.findAll()
        if(!allTypeEdizm.length) {
            await typeEdizm.create({name: 'Экономические единицы'})
            await typeEdizm.create({name: 'Единицы времени'})
            await typeEdizm.create({name: 'Технические единицы'})
            await typeEdizm.create({name: 'Единицы массы'})
            await typeEdizm.create({name: 'Единицы объема'})
            await typeEdizm.create({name: 'Единицы площади'})
            await typeEdizm.create({name: 'Единицы длины (Длина L Ширина A Высота B)'})
            await typeEdizm.create({name: 'Количественные единицы'})
        }
    }


}    