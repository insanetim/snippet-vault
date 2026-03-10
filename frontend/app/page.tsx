"use client"

import { useGetSnippetsQuery } from "@/api/snippetsApiSlice"
import SnippetsList from "@/components/SnippetsList"
import { ErrorAlert, Loading } from "@/components/UI"
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
        onPageChange={() => {}}
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
    </div>
  )
}
