import { ApiProperty } from "@nestjs/swagger";

export class CreateAllDocumentsDto {
    @ApiProperty({example: 'name', description: 'Имя Документа'})
    readonly name: string;
    @ApiProperty({example: '34ргравытваы', description: 'Путь до документа'})
    readonly path: string;
    @ApiProperty({example: 'p', description: 'Принадлежит к странице пользователя. Например Аватарка'})
    readonly nameInstans: string;
}