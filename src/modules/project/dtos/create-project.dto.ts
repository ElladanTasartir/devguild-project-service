import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TechnologyDTO } from './technology-dto';

export class CreateProjectDTO {
  @IsString()
  @MinLength(6)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsUUID()
  user_id: string;

  @IsArray()
  @Type(() => TechnologyDTO)
  @ValidateNested({ each: true })
  technologies: TechnologyDTO[];

  @IsString()
  @IsUrl()
  @Matches(/github\.com/, {
    message: 'The repository must be a github repository URL',
  })
  repository: string;
}
