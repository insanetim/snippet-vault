import type {
  CreateSnippet,
  PaginatedSnippets,
  Snippet,
  SnippetsQueryParams,
  SuccessResponse,
  UpdateSnippet,
} from "@/types/snippets"
import { api } from "./baseApi"

const snippetsApiSlice = api
  .enhanceEndpoints({
    addTagTypes: ["Snippet", "SnippetsList", "Tags"],
  })
  .injectEndpoints({
    endpoints: builder => ({
      // GET /snippets - Get all snippets with pagination and filtering
      getSnippets: builder.query<PaginatedSnippets, SnippetsQueryParams>({
        query: ({ page, q, tag, type }) => ({
          url: "snippets",
          params: { page: page?.toString(), q, tag, type },
        }),
        providesTags: ["SnippetsList"],
      }),

      // GET /snippets/tags - Get all tags
      getTags: builder.query<SuccessResponse<Snippet["tags"]>, void>({
        query: () => "snippets/tags",
        providesTags: ["Tags"],
      }),

      // GET /snippets/:id - Get snippet by ID
      getSnippet: builder.query<SuccessResponse<Snippet>, string>({
        query: id => `snippets/${id}`,
        providesTags: (result, error, id) => [{ type: "Snippet", id }],
      }),

      // POST /snippets - Create new snippet
      createSnippet: builder.mutation<SuccessResponse<Snippet>, CreateSnippet>({
        query: snippetData => ({
          url: "snippets",
          method: "POST",
          body: snippetData,
        }),
        invalidatesTags: ["SnippetsList", "Tags"],
      }),

      // PATCH /snippets/:id - Update snippet
      updateSnippet: builder.mutation<
        SuccessResponse<Snippet>,
        { id: Snippet["id"] } & UpdateSnippet
      >({
        query: ({ id, ...patch }) => ({
          url: `snippets/${id}`,
          method: "PATCH",
          body: patch,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Snippet", id },
          "SnippetsList",
          "Tags",
        ],
      }),

      // DELETE /snippets/:id - Delete snippet
      deleteSnippet: builder.mutation<
        SuccessResponse<{ deleted: boolean; id: string }>,
        Snippet["id"]
      >({
        query: id => ({
          url: `snippets/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["SnippetsList", "Tags"],
      }),
    }),
  })

export const {
  useGetSnippetsQuery,
  useGetTagsQuery,
  useGetSnippetQuery,
  useCreateSnippetMutation,
  useUpdateSnippetMutation,
  useDeleteSnippetMutation,
} = snippetsApiSlice

export default snippetsApiSlice
