import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SnippetIdDto {
  @IsMongoId({ message: 'Invalid snippet ID format' })
  @IsNotEmpty({ message: 'Snippet ID is required' })
  id: string;
}
