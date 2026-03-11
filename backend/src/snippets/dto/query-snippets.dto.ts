import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SnippetType } from '../enums/snippet-type.enum';

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

  @IsOptional()
  @IsEnum(SnippetType, { message: 'Type must be a valid snippet type' })
  type?: SnippetType;
}
