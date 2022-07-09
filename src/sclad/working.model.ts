import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany} from "sequelize-typescript";
import { Assemble } from "src/assemble/assemble.model";
import { WorkingType } from "src/files/enums";
import { Metaloworking } from "src/metaloworking/metaloworking.model";
import { WorkingAssemble } from "./working-assemble.model";
import { WorkingMetall } from "./working-metall.model";

@Table({tableName: 'working'})
export class Working extends Model<Working> {

    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description: 'Номер заказа'})
    @Column({type: DataType.STRING})
    number_order: string;

    @ApiProperty({example: '1', description: 'Дата заказа'})
    @Column({type: DataType.STRING})
    date_order: string;

    @ApiProperty({example: '1', description: 'Дата отгрузки'})
    @Column({type: DataType.STRING})
    date_shipments: string;

    @ApiProperty({example: '1', description: 'Тип объекта'})
    @Column({type: DataType.STRING, defaultValue: WorkingType.ass})
    type: string;

    @ApiProperty({example: '1', description: 'архив?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false })
    ban: boolean;

    @ApiProperty({example: '', description: 'Описание заказа'})
    @Column({type: DataType.STRING})
    description: string;

    @BelongsToMany(() => Assemble, () => WorkingAssemble)
    assemble: Assemble[];

    @BelongsToMany(() => Metaloworking, () => WorkingMetall)
    metall: Metaloworking[];
}     