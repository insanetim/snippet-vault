import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SnippetType } from '../enums/snippet-type.enum';

export class CreateSnippetDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(1, { message: 'Content must be at least 1 character long' })
  @Transform(({ value }) => value?.trim())
  content: string;

  @IsArray({ message: 'Tags must be an array' })
  @ArrayMinSize(0, { message: 'Tags array can be empty' })
  @ArrayMaxSize(10, { message: 'Cannot have more than 10 tags' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value
        .map((tag) => tag?.toLowerCase().trim())
        .filter((tag) => tag && tag.length > 0);
    }
    return [];
  })
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    each: true,
    message: 'Tags can only contain letters, numbers, hyphens and underscores',
  })
  tags: string[];

  @IsEnum(SnippetType, {
    message: 'Type must be either link, note, or command',
  })
  @IsNotEmpty({ message: 'Type is required' })
  type: SnippetType;
}
