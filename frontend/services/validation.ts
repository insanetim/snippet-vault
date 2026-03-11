import { SnippetFormData } from "@/components/SnippetForm"

export interface ValidationError {
  field: string
  message: string
}

export const validateSnippetForm = (
  formData: SnippetFormData
): ValidationError[] => {
  const errors: ValidationError[] = []

  // Validate title
  if (!formData.title || formData.title.trim() === "") {
    errors.push({
      field: "title",
      message: "Title is required",
    })
  }

  // Validate content
  if (!formData.content || formData.content.trim() === "") {
    errors.push({
      field: "content",
      message: "Content is required",
    })
  }

  // Validate type
  if (!formData.type) {
    errors.push({
      field: "type",
      message: "Type is required",
    })
  }

  // Tags are optional, can be empty array
  // No validation needed for tags

  return errors
}

export const formatValidationErrors = (errors: ValidationError[]): string[] => {
  return errors.map(error => error.message)
}
