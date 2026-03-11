import { SnippetType } from "@/types/snippets"

export const getSnippetTypeLabel = (snippetType?: SnippetType): string => {
  switch (snippetType) {
    case "link":
      return "Link"
    case "note":
      return "Note"
    case "command":
      return "Command"
    default:
      return snippetType || "Unknown"
  }
}
