export class CreateNameInstrumentDto {

    readonly name: string;   
    readonly deliveryTime: string; 
    readonly mountUsed: string; 
    readonly minOstatok: string; 
    readonly description: string; 
    readonly parentId: number;
    readonly docs: any;

    readonly providers: string;
    readonly rootParentId: number;

}
