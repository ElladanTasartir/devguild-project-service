import { IsUUID } from 'class-validator';

export class FindProjectByIdDTO {
  @IsUUID()
  id: string;
}
