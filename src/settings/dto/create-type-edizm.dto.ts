import { ApiProperty } from "@nestjs/swagger";

export class CreateTypeEdizmDto{
    @ApiProperty({example: 'Единицы площади', description: 'Тип единицы измерения'})
    readonly name: string;
}