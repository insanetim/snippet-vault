"use client"

import {
  useDeleteSnippetMutation,
  useGetSnippetQuery,
} from "@/api/snippetsApiSlice"
import ActionWithConfirm from "@/components/ActionWithConfirm"
import BackButton from "@/components/BackButton"
import { ErrorAlert, Loading } from "@/components/UI"
import { useSnippetType } from "@/hooks/useSnippetType"
import showToast from "@/services/toast"
import { formatDate } from "@/utils/dateUtils"
import { getErrorMessage } from "@/utils/errorUtils"
import { Calendar, Edit, Tag, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function Page() {
  const params = useParams()
  const router = useRouter()

  const {
    data: snippet,
    error,
    isLoading,
  } = useGetSnippetQuery(params.id as string)
  const [deleteSnippet] = useDeleteSnippetMutation()

  const { getTypeIcon, getTypeColor } = useSnippetType(snippet?.data.type)

  const handleDelete = async () => {
    try {
      await deleteSnippet(snippet!.data.id).unwrap()
      showToast.success("Snippet deleted successfully")
      router.push("/")
    } catch (error) {
      console.error(error)
      showToast.error("Failed to delete snippet")
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorAlert errorMessage={getErrorMessage(error)} />
  }

  if (!snippet) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Snippet not found</p>
      </div>
    )
  }

  return (
    <div>
      <BackButton />
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-base-content">
            Snippet Details
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/${snippet.data.id}/edit`}>
            <button className="btn btn-primary">
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </Link>
          <ActionWithConfirm
            confirmModalProps={{
              title: "Delete Snippet",
              message:
                "Are you sure you want to delete this snippet? This action cannot be undone.",
              confirmText: "Delete",
              cancelText: "Cancel",
              confirmButtonColor: "error",
            }}
            onConfirm={handleDelete}
          >
            <button className="btn btn-error">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </ActionWithConfirm>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`badge ${getTypeColor()} badge-lg`}>
                {getTypeIcon()}
              </div>
              <h2 className="text-2xl font-bold">{snippet.data.title}</h2>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Content</h3>
            <div className="bg-base-200 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {snippet.data.content}
              </pre>
            </div>
          </div>

          {snippet.data.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {snippet.data.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="badge badge-outline badge-lg"
                  >
                    <Tag className="w-4" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-base-content/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4" />
                <span>Created: {formatDate(snippet.data.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4" />
                <span>Updated: {formatDate(snippet.data.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
