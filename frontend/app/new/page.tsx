"use client"

import BackButton from "@/components/BackButton"
import SnippetForm, { SnippetFormData } from "@/components/SnippetForm"

export default function Page() {
  const handleSubmit = (data: SnippetFormData) => {
    console.log("Creating new snippet:", data)
    // Here you would typically make an API call to create the snippet
    alert("Snippet created! Check console for details.")
  }

  return (
    <div>
      <BackButton />
      <SnippetForm
        onSubmit={handleSubmit}
        isEditing={false}
      />
    </div>
  )
}
