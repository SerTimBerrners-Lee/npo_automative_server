

export class CreateMovingDto {
  readonly arr_product: any;
  readonly description: string;
  readonly to_user: number;
  readonly to_sklad: boolean;
  readonly from_user: number;
  readonly from_sklad: boolean;
  readonly cause: string;
}