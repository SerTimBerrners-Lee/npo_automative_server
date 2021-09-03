import { ApiProperty } from "@nestjs/swagger";

export class CreateEdizmDto{
    @ApiProperty({example: 'квадратный миллиметр', description: 'Полная запись единиц измерений'})
    readonly name: string;

    @ApiProperty({example: 'мм2', description: 'Кратка запись единиц измерений'})
    readonly short_name: string;

    @ApiProperty({example: 1, description: 'К какому типу принадлежит'})
    readonly typeEdizmId: number
}