export class UpdateEquipmentDto {

    readonly id: number;
    readonly name: string;   
    readonly deliveryTime: string; 
    readonly invNymber: string; 
    readonly responsible: string; 
    readonly description: string; 
    readonly parentId: number;
    readonly docs: any;

    readonly providers: string;

}
