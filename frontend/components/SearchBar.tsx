import { X } from "lucide-react"

interface SearchBarProps {
  query: string
  tag: string
  availableTags: string[]
  onQueryChange: (query: string) => void
  onTagChange: (tag: string) => void
  onClear: () => void
  onSearch: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  tag,
  availableTags,
  onQueryChange,
  onTagChange,
  onClear,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search snippets..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
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

      {(query || tag) && (
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
