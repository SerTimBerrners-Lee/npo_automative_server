import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, ForeignKey, BelongsTo} from "sequelize-typescript";
import { Assemble } from "src/assemble/assemble.model";
import { Operation } from "src/detal/operation.model";
import { Metaloworking } from "src/metaloworking/metaloworking.model";
import { User } from "src/users/users.model";

interface MarksCreationAttrs {
	readonly date_build: string;
	readonly kol: number;
	readonly user_id: number;
  readonly oper_id: number;
}

@Table({tableName: 'marks'})
export class Marks extends Model<Marks, MarksCreationAttrs> {

    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '21.10.2025', description: 'Дата исполнения'})
    @Column({type: DataType.STRING})
    date_build: string;   

    @ApiProperty({example: 3, description: 'Количество выполненых изделий'})
    @Column({type: DataType.INTEGER})
    kol: number; 

		@ApiProperty({example: 'Описание', description: 'Описание'})
    @Column({type: DataType.STRING})
    description: string;

		@ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    user_id: number;

    @BelongsTo(() => User)
    user: User;
    
		@ForeignKey(() => Operation)
    @Column({type: DataType.INTEGER})
    oper_id: number;

    @BelongsTo(() => Operation)
    operation: Operation;
}     