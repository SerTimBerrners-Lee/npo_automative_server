

export class CreateInventaryDto {
  readonly name: string;
  readonly parent_t_id: number;
  readonly parent_pt_id: number;
  readonly delivery_time: number;
  readonly mount_used: number;
  readonly min_ostatok: number;
  readonly description: string;
  readonly providers: any;
  readonly docs: any;
  readonly id: number;
  readonly documents_base: any;
  readonly attention: boolean;
}