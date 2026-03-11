"use client"

import { useGetTagsQuery } from "@/api/snippetsApiSlice"
import { Snippet, SnippetType } from "@/types/snippets"
import { getSnippetTypeLabel } from "@/utils/snippetsUtils"
import React, { useState } from "react"
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
  initialData?: SnippetFormData
  onSubmit?: (data: SnippetFormData) => void
  isEditing?: boolean
}

const snippetTypes: SnippetType[] = ["link", "note", "command"]

export const SnippetForm: React.FC<SnippetFormProps> = ({
  initialData = initialFormData,
  onSubmit,
  isEditing = false,
}) => {
  const { data: tagsData } = useGetTagsQuery()

  const [formData, setFormData] = useState<SnippetFormData>(initialData)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required!")
      return
    }

    const submitData = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
    }

    console.log("Snippet Form Data:", submitData)

    if (onSubmit) {
      onSubmit(submitData)
    }
  }

  const handleReset = () => {
    setFormData({
      title: initialData?.title || "",
      content: initialData?.content || "",
      type: initialData?.type || "note",
      tags: initialData?.tags || [],
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">
            {isEditing ? "Edit Snippet" : "Create New Snippet"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Title*</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter snippet title..."
                value={formData.title}
                onChange={e => updateFormData("title", e.target.value)}
              />
            </fieldset>

            {/* Content */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Content*</legend>
              <textarea
                className="textarea h-32 w-full font-mono text-sm"
                placeholder="Enter your content here..."
                value={formData.content}
                onChange={e => updateFormData("content", e.target.value)}
              ></textarea>
            </fieldset>

            {/* Type */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Type*</legend>
              <select
                className="select w-full"
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
              <label className="label">
                <span className="label-text font-semibold">Tags</span>
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
