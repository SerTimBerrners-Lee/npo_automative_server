import { ApiProperty } from "@nestjs/swagger";


export class CreatePodMaterialDto {
    @ApiProperty({example: 'Лист', description: 'Запись значений'})
    readonly name: string;
    @ApiProperty({example: '{"edizm": "мм", "znach": "permanent"}', description: 'Запись значений'})
    readonly density: any;
    @ApiProperty({example: 1, description: 'К какому материалу будет принадлежать'})
    readonly id: number;
    @ApiProperty({example: 1, description: 'К какой инстанции относится под тип'})
    readonly instansMaterial: number;
}