import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, AfterSync} from "sequelize-typescript";

interface DeficitCreationAttrs {
    minRemainder: number;
    recommendedRemainder: number;
}

@Table({tableName: 'deficit'})
export class Deficit extends Model<Deficit, DeficitCreationAttrs> {

    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 1, description: 'Минимальный остаток'})
    @Column({type: DataType.INTEGER, defaultValue: 1})
    minRemainder: number;   

    @ApiProperty({example: 3, description: 'Рекомендуемый остаток'})
    @Column({type: DataType.INTEGER, defaultValue: 3})
    recommendedRemainder: number; 
     
    @AfterSync
    static async createDeficit(sync: any) {

        const deficit = await sync.sequelize.models.Deficit
        if(!deficit)
            return 

        const deficitAll = await deficit.findAll()
        if(!deficitAll.length) {
            await deficit.create()
        }
    }
}     