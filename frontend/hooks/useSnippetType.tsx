import { SnippetType } from "@/types/snippets"
import { FileText, Link as LinkIcon, Terminal } from "lucide-react"

export const useSnippetType = (type?: SnippetType) => {
  const getTypeIcon = () => {
    switch (type) {
      case "link":
        return <LinkIcon className="w-4 h-4" />
      case "command":
        return <Terminal className="w-4 h-4" />
      case "note":
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case "link":
        return "badge-info"
      case "command":
        return "badge-warning"
      case "note":
      default:
        return "badge-success"
    }
  }

  return { getTypeIcon, getTypeColor }
}
