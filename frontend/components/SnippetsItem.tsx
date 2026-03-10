import { Snippet } from "@/types/snippets"
import { formatDate } from "@/utils/dateUtils"
import {
  Calendar,
  Edit,
  FileText,
  Link as LinkIcon,
  Tag,
  Terminal,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface SnippetsItemProps {
  snippet: Snippet
  onRemove?: (id: string) => void
  onTagSelect?: (tag: string) => void
}

const SnippetsItem: React.FC<SnippetsItemProps> = ({
  snippet,
  onRemove,
  onTagSelect,
}) => {
  const getTypeIcon = (type: string) => {
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

  const getTypeColor = (type: string) => {
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

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition-shadow duration-200">
      <div className="card-body p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`badge ${getTypeColor(snippet.type)} badge-sm`}>
              {getTypeIcon(snippet.type)}
            </div>
            <Link
              href={`/${snippet.id}`}
              className="font-semibold text-base truncate hover:text-primary transition-colors"
            >
              {snippet.title}
            </Link>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-base-content/70 line-clamp-2">
            {snippet.content}
          </p>
        </div>

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {snippet.tags.slice(0, 3).map((tag, index) => (
              <button
                key={index}
                className="badge badge-outline badge-sm hover:badge-primary transition-colors cursor-pointer"
                onClick={() => {
                  onTagSelect?.(tag)
                }}
              >
                <Tag className="w-3" />
                {tag}
              </button>
            ))}
            {snippet.tags.length > 3 && (
              <span className="badge badge-outline badge-xs">
                +{snippet.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-base-content/50 flex items-center gap-1">
            <Calendar className="w-3" />
            <span>{formatDate(snippet.updatedAt)}</span>
          </div>

          <div
            className="flex gap-1"
            onClick={e => e.stopPropagation()}
          >
            <Link href={`/${snippet.id}/edit`}>
              <button className="btn btn-ghost btn-xs">
                <Edit className="w-3" />
              </button>
            </Link>

            <button
              className="btn btn-ghost btn-error btn-xs"
              onClick={e => {
                e.stopPropagation()
                onRemove?.(snippet.id)
              }}
            >
              <Trash2 className="w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnippetsItem
