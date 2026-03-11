"use client"

import type { SnippetsQueryParams, SnippetType } from "@/types/snippets"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

export function useSnippetQueryParams() {
  const searchParams = useSearchParams()

  // Initialize state from URL search params
  const [page, setPage] = useState(searchParams.get("page") || "")
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [tag, setTag] = useState(searchParams.get("tag") || "")
  const [type, setType] = useState<SnippetType | string>(
    searchParams.get("type") || ""
  )

  // Computed query object
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

  const [debouncedQuery] = useDebounceValue(computedQuery, 500)

  // Update URL when debounced query changes
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

  // Handler functions
  const handlePageChange = (newPage: number) => {
    setPage(newPage > 1 ? newPage.toString() : "")
  }

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
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

  const handleClear = () => {
    setQuery("")
    setTag("")
    setType("")
    setPage("")
  }

  return {
    // State
    page,
    query,
    tag,
    type: type as SnippetType,
    debouncedQuery,

    // Handlers
    handlePageChange,
    handleQueryChange,
    handleTagChange,
    handleTypeChange,
    handleClear,
  }
}
