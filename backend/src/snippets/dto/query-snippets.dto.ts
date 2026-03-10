import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QuerySnippetsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  @Type(() => String)
  q?: string;

  @IsOptional()
  @IsString({ message: 'Tag must be a string' })
  @Type(() => String)
  tag?: string;
}
