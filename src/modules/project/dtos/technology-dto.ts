import { IsInt, Min } from 'class-validator';

export class TechnologyDTO {
  @IsInt()
  @Min(1)
  technology_id: number;
}
