import { X } from "lucide-react"
import { SnippetType } from "../types/snippets"

interface SearchBarProps {
  query: string
  tag: string
  type: SnippetType | ""
  availableTags: string[]
  onQueryChange: (query: string) => void
  onTagChange: (tag: string) => void
  onTypeChange: (type: SnippetType | "") => void
  onClear: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  tag,
  type,
  availableTags,
  onQueryChange,
  onTagChange,
  onTypeChange,
  onClear,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search snippets..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div className="sm:w-48">
        <select
          value={tag}
          onChange={e => onTagChange(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">All Tags</option>
          {availableTags.map(tag => (
            <option
              key={tag}
              value={tag}
            >
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-48">
        <select
          value={type}
          onChange={e => onTypeChange(e.target.value as SnippetType | "")}
          className="select select-bordered w-full"
        >
          <option value="">All Types</option>
          <option value="link">Link</option>
          <option value="note">Note</option>
          <option value="command">Command</option>
        </select>
      </div>

      {(query || tag || type) && (
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="btn btn-outline"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchBar
