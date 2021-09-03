import { ApiProperty } from "@nestjs/swagger";

export class UpdateMaterialDto {
    @ApiProperty({example: 'Лист', description: 'Запись значений'})
    readonly name: string;
    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly length: [];    

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly width: [];    

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly height: [];   

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly wallThickness: [];   

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly outsideDiametr: []; 
    
    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly thickness: [];   

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly areaCrossSectional: [];   

    @ApiProperty({example: 1, description: 'Идентификатор записи'})
    readonly id: number;   
}