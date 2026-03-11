"use client"

import {
  useGetSnippetQuery,
  useUpdateSnippetMutation,
} from "@/api/snippetsApiSlice"
import BackButton from "@/components/BackButton"
import SnippetForm, { SnippetFormData } from "@/components/SnippetForm"
import { ErrorAlert, Loading } from "@/components/UI"
import showToast from "@/services/toast"
import { getErrorMessage } from "@/utils/errorUtils"
import { useParams, useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const params = useParams()

  const {
    data: snippet,
    isLoading,
    error,
  } = useGetSnippetQuery(params.id as string)
  const [updateSnippet, { isLoading: isUpdating, error: submitError }] =
    useUpdateSnippetMutation()

  const handleSubmit = async (data: SnippetFormData) => {
    try {
      await updateSnippet({ ...data, id: snippet!.data.id }).unwrap()
      showToast.success("Snippet updated successfully")
      router.push("/")
    } catch (error) {
      console.error("Error submitting response:", error)
      showToast.error("Failed to update snippet")
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
      <SnippetForm
        initialData={snippet?.data}
        onSubmit={handleSubmit}
        isEditing={false}
        isLoading={isUpdating}
        submitError={submitError}
      />
    </div>
  )
}
