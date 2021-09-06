import { ApiProperty } from "@nestjs/swagger";

export class CreatePodPodMaterial {
    @ApiProperty({example: 1, description: 'Индетификатор записи'})
    readonly id: number;
    @ApiProperty({example: 'Лист', description: 'Запись значений'})
    readonly name: string;

    readonly docs: string;
    @ApiProperty({example: 1, description: 'Id подтипа материала к которой принадлежит'})
    readonly podTypeId: number;  
    @ApiProperty({example: 1, description: 'Id ЕИ к которой принадлежит'})
    readonly edizmId: number;  

    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Срок поставки'})
    readonly deliveryTime: string; 
    @ApiProperty({example: 'материал железо', description: 'Описание материала'})
    readonly description: string; 
    @ApiProperty({example: '{"edizmId": 1, "znach": 123}', description: 'Срок поставки'})
    readonly metrMass: string; 

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


}