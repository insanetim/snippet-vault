"use client"

import {
  useDeleteSnippetMutation,
  useGetSnippetsQuery,
  useGetTagsQuery,
} from "@/api/snippetsApiSlice"
import ConfirmationModal from "@/components/ConfirmationModal"
import SnippetsList from "@/components/SnippetsList"
import { ErrorAlert, Loading } from "@/components/UI"
import showToast from "@/services/toast"
import type { SnippetsQueryParams, SnippetType } from "@/types/snippets"
import { getErrorMessage } from "@/utils/errorUtils"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import SearchBar from "../components/SearchBar"

export default function Page() {
  const searchParams = useSearchParams()

  const [page, setPage] = useState(searchParams.get("page") || "")
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [tag, setTag] = useState(searchParams.get("tag") || "")
  const [type, setType] = useState<SnippetType | string>(
    searchParams.get("type") || ""
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null)

  const computedQuery = useMemo((): SnippetsQueryParams => {
    const result: SnippetsQueryParams = {}

    if (page) {
      const pageNum = parseInt(page, 10)
      if (!isNaN(pageNum)) {
        result.page = pageNum
      }
    }

    if (query) {
      result.q = query
    }

    if (tag) {
      result.tag = tag
    }

    if (type) {
      result.type = type as SnippetType
    }

    return result
  }, [page, query, tag, type])

  const [debouncedQuery] = useDebounceValue(computedQuery, 300)

  const {
    data: snippets,
    error,
    isLoading,
  } = useGetSnippetsQuery(debouncedQuery)
  const { data: tagsData } = useGetTagsQuery()
  const [deleteSnippet] = useDeleteSnippetMutation()

  const handleDeleteClick = (id: string) => {
    setSnippetToDelete(id)
    setModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!snippetToDelete) return

    try {
      await deleteSnippet(snippetToDelete).unwrap()
      showToast.success("Snippet deleted successfully")

      // Check if we need to navigate to previous page
      if (snippets?.data.length === 1 && snippets.page > 1) {
        handlePageChange(snippets.page - 1)
      }
    } catch (error) {
      console.error(error)
      showToast.error("Failed to delete snippet")
    } finally {
      setModalOpen(false)
      setSnippetToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setModalOpen(false)
    setSnippetToDelete(null)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage > 1 ? newPage.toString() : "")
  }

  const handleSearch = () => {
    // URL updates are now handled by useEffect on debouncedQuery
  }

  const handleClear = () => {
    setQuery("")
    setTag("")
    setType("")
    setPage("")
  }

  const handleTagChange = (newTag: string) => {
    setTag(newTag)
    setPage("")
  }

  const handleTypeChange = (newType: string) => {
    setType(newType)
    setPage("")
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Update query parameter
    if (debouncedQuery.q) {
      params.set("q", debouncedQuery.q)
    } else {
      params.delete("q")
    }

    // Update tag parameter
    if (debouncedQuery.tag) {
      params.set("tag", debouncedQuery.tag)
    } else {
      params.delete("tag")
    }

    // Update type parameter
    if (debouncedQuery.type) {
      params.set("type", debouncedQuery.type)
    } else {
      params.delete("type")
    }

    // Update page parameter
    if (debouncedQuery.page) {
      params.set("page", debouncedQuery.page.toString())
    } else {
      params.delete("page")
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname

    // Only update if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.pushState(null, "", newUrl)
    }
  }, [debouncedQuery])

  let content

  if (isLoading) {
    content = <Loading />
  } else if (error) {
    content = <ErrorAlert errorMessage={getErrorMessage(error)} />
  } else if (snippets?.data.length === 0) {
    content = (
      <p className="text-gray-500">
        {computedQuery.q || computedQuery.tag
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
        onRemove={handleDeleteClick}
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
        type={type as SnippetType}
        availableTags={tagsData?.data || []}
        onQueryChange={setQuery}
        onTagChange={handleTagChange}
        onTypeChange={handleTypeChange}
        onClear={handleClear}
        onSearch={handleSearch}
      />
      {content}
      <ConfirmationModal
        open={modalOpen}
        title="Delete Snippet"
        message="Are you sure you want to delete this snippet? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}
