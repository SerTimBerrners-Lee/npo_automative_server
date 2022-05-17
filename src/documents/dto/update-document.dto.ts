

export class UpdateDocumentDto {
  readonly name: string;
  readonly version: number;
  readonly type: string;
  readonly responsible_user_id: number;
  readonly id: number;
  readonly description: string;
  readonly ava: boolean;
}