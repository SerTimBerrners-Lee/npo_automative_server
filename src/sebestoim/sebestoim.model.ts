import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Cbed } from "src/cbed/cbed.model";
import { Detal } from "src/detal/detal.model";
import { User } from "src/users/users.model";

interface SebestoimCreationAttrs {
    name: string;
}

@Table({tableName: 'sebestoim'})
export class Sebestoim extends Model<Sebestoim, SebestoimCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Круг 20 D', description: 'Полная запись под материала измерений'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ForeignKey(() => Detal)
    @Column({type: DataType.INTEGER})
    detalId: number;

    @BelongsTo(() => Detal)
    detal: Detal;

    @ForeignKey(() => Cbed)
    @Column({type: DataType.INTEGER})
    cbedId: number;

    @BelongsTo(() => Cbed)
    cbed: Cbed;
}     