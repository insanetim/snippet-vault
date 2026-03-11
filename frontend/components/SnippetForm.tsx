"use client"

import { useGetTagsQuery } from "@/api/snippetsApiSlice"
import {
  formatValidationErrors,
  validateSnippetForm,
} from "@/services/validation"
import { Snippet, SnippetType } from "@/types/snippets"
import { getErrorMessage } from "@/utils/errorUtils"
import { getSnippetTypeLabel } from "@/utils/snippetsUtils"
import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import React, { useMemo, useState } from "react"
import { ErrorAlert } from "./UI"
import { MultipleSelect } from "./UI/MultipleSelect"

export type SnippetFormData = Pick<
  Snippet,
  "title" | "content" | "tags" | "type"
>

const initialFormData: SnippetFormData = {
  title: "",
  content: "",
  tags: [],
  type: "note",
}

interface SnippetFormProps {
  initialData?: Snippet
  onSubmit?: (data: SnippetFormData) => void
  isEditing?: boolean
  isLoading?: boolean
  submitError?: FetchBaseQueryError | SerializedError
}

const snippetTypes: SnippetType[] = ["link", "note", "command"]

export const SnippetForm: React.FC<SnippetFormProps> = ({
  initialData = initialFormData,
  onSubmit,
  isEditing = false,
  isLoading = false,
  submitError,
}) => {
  const { data: tagsData } = useGetTagsQuery()

  const [formData, setFormData] = useState<SnippetFormData>({
    title: initialData.title,
    content: initialData.content,
    tags: initialData.tags,
    type: initialData.type,
  })
  const [hasErrors, setHasErrors] = useState(false)

  const validationErrors = useMemo(() => {
    if (!hasErrors) return []

    const data: SnippetFormData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags.filter(tag => tag && tag.length > 0),
      type: formData.type,
    }

    return validateSnippetForm(data)
  }, [hasErrors, formData])

  const errorMessage = useMemo(() => {
    if (submitError) {
      return getErrorMessage(submitError)
    } else if (validationErrors.length > 0) {
      return formatValidationErrors(validationErrors)
    }
  }, [submitError, validationErrors])

  // Convert tags data to MultipleSelect format
  const predefinedTags = React.useMemo(() => {
    if (!tagsData?.data) return []
    return tagsData.data.map((tag: string) => ({
      value: tag,
      label: tag,
    }))
  }, [tagsData])

  const updateFormData = <T extends keyof SnippetFormData>(
    key: T,
    value: SnippetFormData[T]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const validateFormData = () => {
    const data: SnippetFormData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags.filter(tag => tag && tag.length > 0),
      type: formData.type,
    }

    const validationErrors = validateSnippetForm(data)
    const hasValidationErrors = validationErrors.length > 0

    setHasErrors(hasValidationErrors)

    return hasValidationErrors ? null : data
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = validateFormData()

    if (!data) return

    if (onSubmit) {
      onSubmit(data)
    }
  }

  const handleReset = () => {
    setFormData(initialFormData)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">
            {isEditing ? "Edit Snippet" : "Create New Snippet"}
          </h2>

          {errorMessage && (
            <div className="mb-4">
              <ErrorAlert errorMessage={errorMessage} />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Title*</legend>
              <input
                type="text"
                className={`input w-full ${validationErrors.some(error => error.field === "title") ? "input-error" : ""}`}
                placeholder="Enter snippet title..."
                value={formData.title}
                onChange={e => updateFormData("title", e.target.value)}
              />
            </fieldset>

            {/* Content */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Content*</legend>
              <textarea
                className={`textarea h-32 w-full font-mono text-sm ${validationErrors.some(error => error.field === "content") ? "textarea-error" : ""}`}
                placeholder="Enter your content here..."
                value={formData.content}
                onChange={e => updateFormData("content", e.target.value)}
              ></textarea>
            </fieldset>

            {/* Type */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Type*</legend>
              <select
                className={`select w-full ${validationErrors.some(error => error.field === "type") ? "select-error" : ""}`}
                value={formData.type}
                onChange={e =>
                  updateFormData("type", e.target.value as SnippetType)
                }
              >
                <option disabled={true}>Select a type</option>
                {snippetTypes.map((type: SnippetType) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {getSnippetTypeLabel(type)}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Tags */}
            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text text-xs text-base-content font-semibold">
                  Tags
                </span>
              </label>
              <MultipleSelect
                options={predefinedTags}
                value={formData.tags}
                onChange={value => updateFormData("tags", value)}
                placeholder="Select or add tags..."
                customPlaceholder="Add custom tag..."
                className="w-full"
              />
              <label className="label">
                <span className="label-text-alt">
                  Select from predefined tags or add your own
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="card-actions justify-end mt-8">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost"
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isEditing ? "Update Snippet" : "Create Snippet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SnippetForm
