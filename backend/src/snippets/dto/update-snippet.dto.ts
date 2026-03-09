import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional } from 'class-validator';
import { CreateSnippetDto } from './create-snippet.dto';

export class UpdateSnippetDto extends PartialType(CreateSnippetDto) {
  @IsOptional()
  @IsMongoId({ message: 'Invalid ID format' })
  id?: string;
}
