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

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  totalCount: number
}

export type SuccessResponse<T> = T & {
  success: true
  message?: string
}

export type PaginatedSnippets = SuccessResponse<PaginatedResponse<Snippet>>

export interface SnippetsQueryParams {
  page?: number
  q?: string
  tag?: string
}
