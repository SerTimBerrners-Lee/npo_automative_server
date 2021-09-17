import { ApiProperty } from "@nestjs/swagger";

export class CreateMaterialDto {
    @ApiProperty({example: 'Лист', description: 'Запись значений'})
    readonly name: string;
    @ApiProperty({example: '{"edizm": "мм", "znach": 123}', description: 'Запись значений'})
    readonly length: any;    

    @ApiProperty({example: '{"edizm": "мм", "znach": 123}', description: 'Запись значений'})
    readonly width: any;    

    @ApiProperty({example: '{"edizm": "мм", "znach": 123}', description: 'Запись значений'})
    readonly height: any;   

    @ApiProperty({example: '{"edizm": "мм", "znach": 123}', description: 'Запись значений'})
    readonly wallThickness: any;   

    @ApiProperty({example: '{"edizm": "мм", "znach": 123}', description: 'Запись значений'})
    readonly outsideDiametr: any; 
    
    @ApiProperty({example: '{"edizm": "мм", "znach": 123}', description: 'Запись значений'})
    readonly thickness: any;   

    @ApiProperty({example: '{"edizm": "мм", "znach": 123}', description: 'Запись значений'})
    readonly areaCrossSectional: any;   

    @ApiProperty({example: 1, description: 'К какой инстанции относится под тип'})
    readonly instansMaterial: number;
}