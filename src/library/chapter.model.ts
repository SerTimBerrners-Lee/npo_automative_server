import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table} from "sequelize-typescript";

interface ChapterAttrCreate {
  name: string;
}

@Table({tableName: 'chapter', createdAt: false, updatedAt: false})
export class Chapter extends Model<Chapter, ChapterAttrCreate> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description: 'Наименование раздела библиотеки'})
    @Column({type: DataType.STRING})
    name: string;
}  