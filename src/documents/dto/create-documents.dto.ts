import { ApiProperty } from "@nestjs/swagger";

export default class CreateDocumentsDto {
    @ApiProperty({example: 'name', description: 'Имя Документа'})
    readonly name: string;
    @ApiProperty({example: '34ргравытваы', description: 'Путь до документа'})
    readonly path: string;
    @ApiProperty({example: 'p', description: 'Принадлежит к странице пользователя. Например Аватарка'})
    readonly nameInstans: string;
    @ApiProperty({example: 'Новая фотография', description: 'Описание документа'})
    readonly description: string;
    @ApiProperty({example: '0.1.1', description: 'Версия документа'})
    readonly version: string;
    @ApiProperty({example: 'МД', description: 'Тип документа'})
    readonly type: string;
}