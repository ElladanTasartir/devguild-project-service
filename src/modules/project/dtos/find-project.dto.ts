import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FindProjectDTO {
  @IsOptional()
  @Transform(({ value }) => value.split(',').map((val: string) => Number(val)))
  @IsInt({ each: true })
  @IsPositive({ each: true })
  technology_ids: number[];
}
