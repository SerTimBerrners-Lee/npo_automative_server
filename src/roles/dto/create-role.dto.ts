import {ApiProperty} from '@nestjs/swagger';

export class CreateRoleDto{
    @ApiProperty({example: 'ADMIN', description: 'администратор'})
    readonly value: string;
    @ApiProperty({example: 'администратор', description: 'описание роли'})
    readonly description: string; 
}