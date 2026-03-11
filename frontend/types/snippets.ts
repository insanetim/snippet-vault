export type SnippetType = "link" | "note" | "command"

export interface Snippet {
  id: string
  title: string
  content: string
  tags: string[]
  type: SnippetType
  createdAt: string
  updatedAt: string
}

export type CreateSnippet = Pick<Snippet, "title" | "content" | "tags" | "type">

export type UpdateSnippet = Partial<CreateSnippet>

export type PaginatedResponse<T> = SuccessResponse<T> & {
  data: T[]
  page: number
  totalPages: number
  totalCount: number
}

export type SuccessResponse<T> = {
  data: T
  success: true
  message?: string
}

export type PaginatedSnippets = PaginatedResponse<Snippet>

export interface SnippetsQueryParams {
  page?: number
  q?: string
  tag?: string
  type?: SnippetType
}
