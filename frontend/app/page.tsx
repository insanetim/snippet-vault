"use client"

import {
  useDeleteSnippetMutation,
  useGetSnippetsQuery,
} from "@/api/snippetsApiSlice"
import ConfirmationModal from "@/components/ConfirmationModal"
import SnippetsList from "@/components/SnippetsList"
import { ErrorAlert, Loading } from "@/components/UI"
import showToast from "@/services/toast"
import type { SnippetsQueryParams } from "@/types/snippets"
import { getErrorMessage } from "@/utils/errorUtils"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

export default function Page() {
  const searchParams = useSearchParams()

  const [page, setPage] = useState(searchParams.get("page") || "")
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [tag, setTag] = useState(searchParams.get("tag") || "")
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

    return result
  }, [page, query, tag])

  const {
    data: snippets,
    error,
    isLoading,
  } = useGetSnippetsQuery(computedQuery)
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
    const params = new URLSearchParams(searchParams.toString())

    if (newPage > 1) {
      params.set("page", newPage.toString())
      setPage(newPage.toString())
    } else {
      params.delete("page")
      setPage("")
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname
    window.history.pushState(null, "", newUrl)
  }

  let content

  if (isLoading) {
    content = <Loading />
  } else if (error) {
    content = <ErrorAlert errorMessage={getErrorMessage(error)} />
  } else if (snippets?.data.length === 0) {
    content = (
      <p className="text-gray-500">No forms found. Create your first form!</p>
    )
  } else if (snippets?.data && snippets?.data.length > 0) {
    content = (
      <SnippetsList
        snippets={snippets.data}
        page={snippets.page}
        totalPages={snippets.totalPages}
        onPageChange={handlePageChange}
        onRemove={handleDeleteClick}
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
