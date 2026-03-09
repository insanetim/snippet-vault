import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SnippetType } from '../enums/snippet-type.enum';

export class QuerySnippetsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  @Type(() => String)
  q?: string;

  @IsOptional()
  @IsString({ message: 'Tag must be a string' })
  @Type(() => String)
  tag?: string;

  @IsOptional()
  @IsEnum(SnippetType, {
    message: 'Type must be either link, note, or command',
  })
  @Type(() => String)
  type?: SnippetType;
}
