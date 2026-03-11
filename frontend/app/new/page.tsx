"use client"

import { useCreateSnippetMutation } from "@/api/snippetsApiSlice"
import BackButton from "@/components/BackButton"
import SnippetForm, { SnippetFormData } from "@/components/SnippetForm"
import showToast from "@/services/toast"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  const [createSnippet, { isLoading, error: submitError }] =
    useCreateSnippetMutation()

  const handleSubmit = async (data: SnippetFormData) => {
    try {
      await createSnippet(data).unwrap()
      showToast.success("Snippet created successfully")
      router.push("/")
    } catch (error) {
      console.error("Error submitting response:", error)
      showToast.error("Failed to create snippet")
    }
  }

  return (
    <div>
      <BackButton />
      <SnippetForm
        onSubmit={handleSubmit}
        isEditing={false}
        isLoading={isLoading}
        submitError={submitError}
      />
    </div>
  )
}
