export class UpdateNameInstrumentDto {
    readonly id: number;
    readonly name: string;   
    readonly deliveryTime: string; 
    readonly mountUsed: string; 
    readonly minOstatok: string; 
    readonly description: string; 
    readonly docs: any;
    readonly attention: boolean;

    readonly providers: any;
}
