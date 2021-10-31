
export class UpCreateOperationDto {
    readonly name:                  number;   
    readonly preTime:               number;
    readonly helperTime:            number;
    readonly mainTime:              number; 
    readonly generalCountTime:      string; 
    readonly description:           string; 
    readonly docs:                  any;

    readonly instrumentList:        any;
    readonly instrumentMerList:     any;
    readonly instrumentOsnList:     any;
    readonly eqList:                any;
    readonly id:                    number;
}