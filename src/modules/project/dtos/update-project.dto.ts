import {
  IsString,
  IsUrl,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateProjectDTO {
  @IsString()
  @MinLength(6)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  description?: string;

  @IsString()
  @IsUrl()
  @Matches(/github\.com/, {
    message: 'The repository must be a github repository URL',
  })
  @IsOptional()
  repository?: string;
}
