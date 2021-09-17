import { ApiProperty } from "@nestjs/swagger";

export class UpdateMaterialDto {
    @ApiProperty({example: 'Лист', description: 'Запись значений'})
    readonly name: string;
    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly length: string;    

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly width: string;    

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly height: string;   

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly wallThickness: string;   

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly outsideDiametr: string; 
    
    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly thickness: string;   

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Запись значений'})
    readonly areaCrossSectional: string;   

    @ApiProperty({example: 1, description: 'Идентификатор записи'})
    readonly id: number;   

    @ApiProperty({example: 1, description: 'К какой инстанции относится под тип'})
    readonly instansMaterial: number;
}