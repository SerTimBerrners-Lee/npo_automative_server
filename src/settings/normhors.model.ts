import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, AfterSync } from "sequelize-typescript";
import { TypeEdizm } from "./type-edizm.model";

@Table({tableName: 'norm_hors', createdAt: false, updatedAt: false})
export class NormHors extends Model<NormHors> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Стоимость норма-часа', description: 'Наименование'})
    @Column({type: DataType.STRING})
    name: string;    

    @ApiProperty({example: 'руб.', description: 'Кратка запись единиц измерений'})
    @Column({type: DataType.STRING})
    ez: string;    

    @ApiProperty({example: 199, description: 'Значение'})
    @Column({type: DataType.INTEGER})
    znach: number; 

    @AfterSync
    static async checkEdizm(sync: any) {
      const nch = await sync.sequelize.models.NormHors
      if(!nch)
        return 

      const nchAll = await nch.findAll()
      if(!nchAll.length) {
        await nch.create({name: 'Стоимость норма-часа', ez: 'руб', znach: 199})
      }
    }
}    