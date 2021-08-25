import { ApiProperty } from "@nestjs/swagger";
import {  IsString } from "class-validator";

export class AddRoleDto{
    @ApiProperty({example: 'ADMIN', description: 'Наименование роли'})
    @IsString({message: 'Должно быть строкой'})
    readonly value: string;
    @ApiProperty({example: '21', description: 'Идентификатор пользователя'})
    readonly userId: number;
}