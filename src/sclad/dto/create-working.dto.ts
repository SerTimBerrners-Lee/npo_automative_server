interface WComplect {
  my_kolvo: 					number;
  shipments_kolvo: 	  number;
  cbed_id: 					  number;	
  detal_id: 					number;	
}

interface WData {
  date_order:         string;
  number_order: 			string;
  description : 			string;
  type: 							string;
}

export class CreateWorkingDto {
  readonly workers_data:      WData;
  readonly workers_complect:  Array<WComplect>;
} 