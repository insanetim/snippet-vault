import { Expose, Transform, Type } from 'class-transformer';

export class SnippetResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  tags: string[];

  @Expose()
  type: string;

  @Expose()
  @Transform(({ obj }) => obj.createdAt || obj.created_at)
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.updatedAt || obj.updated_at)
  updatedAt: Date;
}

export class PaginatedSnippetsResponseDto {
  @Expose()
  @Type(() => SnippetResponseDto)
  data: SnippetResponseDto[];

  @Expose()
  page: number;

  @Expose()
  totalPages: number;

  @Expose()
  totalCount: number;
}
