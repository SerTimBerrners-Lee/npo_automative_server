export class CreateProviderDto {

    readonly id:                number;
    readonly name:              string;    
    readonly inn:               string;
    readonly cpp:               string;    
    readonly rekvisit:          string;
    readonly contacts:          string;
    readonly description:       string;
    readonly docs:              any;
    readonly materialList:      any;
    readonly toolListId:        any;
    readonly equipmentListId:   any;
    readonly attention:         boolean;
}