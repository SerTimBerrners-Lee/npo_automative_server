

export class UpCreateShipmentsDto {
	readonly id: 									number;
	readonly date_order: 					string;
	readonly date_shipments: 			string;
	readonly number_order: 				string;
	readonly kol: 							number;
	readonly day_when_shipments: 	number;
	readonly bron : 							boolean;
	readonly base:								string;
	readonly buyer: 							number;
	readonly to_sklad: 						boolean;
	readonly product: 						any;
	readonly list_cbed_detal: 		any;
	readonly list_material: 			any;
	readonly description: 				string;

}