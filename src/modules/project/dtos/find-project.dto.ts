import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class FindProjectDTO {
  @IsOptional()
  @Transform(({ value }) => value.split(',').map((val: string) => Number(val)))
  @IsInt({ each: true })
  @IsPositive({ each: true })
  technology_ids: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
