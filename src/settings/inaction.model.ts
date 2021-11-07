import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, AfterSync } from "sequelize-typescript";


@Table({tableName: 'inaction'})
export class Inaction extends Model<Inaction> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 12, description: 'Время бездействия пользователя'})
  @Column({type: DataType.INTEGER, defaultValue: 12})
  inaction: number;    

  @AfterSync
  static async checkInaction(sync: any) {
    const inaction = await sync.sequelize.models.Inaction
    if(!inaction)
      return 

    const inaction_all = await inaction.findAll()
    if(!inaction_all.length) {
      await inaction.create()
    }
  }

}    