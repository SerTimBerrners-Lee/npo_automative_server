import { ApiProperty } from "@nestjs/swagger";


export class CreatePodMaterialDto {
    @ApiProperty({example: 'Лист', description: 'Запись значений'})
    readonly name: string;
    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly density: [];
    @ApiProperty({example: 1, description: 'К какому материалу будет принадлежать'})
    readonly materialId: number;
}