export class CreateEquipmentDto {

    readonly name: string;   
    readonly deliveryTime: string; 
    readonly invNymber: string; 
    readonly responsible: string; 
    readonly description: string; 
    readonly parentId: number;
    readonly docs: any;

    readonly providers: string;
    readonly instrumentIdList: any;
    readonly rootParentId: number;
    readonly attention: boolean;
}
