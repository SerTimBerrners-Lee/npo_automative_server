import { ApiProperty } from "@nestjs/swagger";

export class CreatePodPodMaterial {
    @ApiProperty({example: 1, description: 'Индетификатор записи'})
    readonly id: number;
    @ApiProperty({example: 'Лист', description: 'Запись значений'})
    readonly name: string;

    @ApiProperty({example: 1, description: 'Родительский тип'})
    readonly rootParentId: number;

    readonly docs: any;
    readonly density: string;
    @ApiProperty({example: 1, description: 'Id подтипа материала к которой принадлежит'})
    readonly podTypeId: number;  
    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Id ЕИ к которой принадлежит'})
    readonly kolvo: string;  

    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Срок поставки'})
    readonly deliveryTime: string; 
    @ApiProperty({example: 'материал железо', description: 'Описание материала'})
    readonly description: string;

    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Запись значений'})
    readonly length: string;    
    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Запись значений'})
    readonly width: string;    
    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Запись значений'})
    readonly height: string;   
    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Запись значений'})
    readonly wallThickness: string;   
    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Запись значений'})
    readonly outsideDiametr: string; 
    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Запись значений'})
    readonly thickness: string;   
    @ApiProperty({example: '{"edizm": 1, "znach": 123}', description: 'Запись значений'})
    readonly areaCrossSectional: string;  
    readonly attention: boolean;

    readonly providers: any;
    readonly file_base: any;


}