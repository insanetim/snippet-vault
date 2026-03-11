"use client"

import {
  useDeleteSnippetMutation,
  useGetSnippetsQuery,
  useGetTagsQuery,
} from "@/api/snippetsApiSlice"
import SnippetsList from "@/components/SnippetsList"
import { ErrorAlert, Loading } from "@/components/UI"
import { useSnippetQueryParams } from "@/hooks/useSnippetQueryParams"
import showToast from "@/services/toast"
import { getErrorMessage } from "@/utils/errorUtils"
import { Plus } from "lucide-react"
import Link from "next/link"
import SearchBar from "../components/SearchBar"

export default function Page() {
  const {
    query,
    tag,
    type,
    debouncedQuery,
    handlePageChange,
    handleQueryChange,
    handleTagChange,
    handleTypeChange,
    handleClear,
  } = useSnippetQueryParams()

  const {
    data: snippets,
    error,
    isLoading,
  } = useGetSnippetsQuery(debouncedQuery)
  const { data: tagsData } = useGetTagsQuery()
  const [deleteSnippet] = useDeleteSnippetMutation()

  const handleDeleteSnippet = async (id: string) => {
    try {
      await deleteSnippet(id).unwrap()
      showToast.success("Snippet deleted successfully")

      // Check if we need to navigate to previous page
      if (snippets?.data.length === 1 && snippets.page > 1) {
        handlePageChange(snippets.page - 1)
      }
    } catch (error) {
      console.error(error)
      showToast.error("Failed to delete snippet")
    }
  }

  let content

  if (isLoading) {
    content = <Loading />
  } else if (error) {
    content = <ErrorAlert errorMessage={getErrorMessage(error)} />
  } else if (snippets?.data.length === 0) {
    content = (
      <p className="text-gray-500">
        {debouncedQuery.q || debouncedQuery.tag || debouncedQuery.type
          ? "No results found"
          : "No snippets found"}
      </p>
    )
  } else if (snippets?.data && snippets?.data.length > 0) {
    content = (
      <SnippetsList
        snippets={snippets.data}
        page={snippets.page}
        totalPages={snippets.totalPages}
        onPageChange={handlePageChange}
        onRemove={handleDeleteSnippet}
        onTagSelect={handleTagChange}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-base-content">Snippets</h1>
        <Link href="/new">
          <button className="btn btn-primary btn-lg">
            <Plus className="w-5 h-5" />
            Add New
          </button>
        </Link>
      </div>
      <SearchBar
        query={query}
        tag={tag}
        type={type}
        availableTags={tagsData?.data || []}
        onQueryChange={handleQueryChange}
        onTagChange={handleTagChange}
        onTypeChange={handleTypeChange}
        onClear={handleClear}
      />
      {content}
    </div>
  )
}
