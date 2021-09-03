import { ApiProperty } from "@nestjs/swagger";

export class ChangeTypeDto {
    @ApiProperty({example: 1, description: 'Идентификатор Документа'})
    readonly id: number;
    @ApiProperty({example: 'МД', description: 'Медиа файл '})
    readonly type: string;
}