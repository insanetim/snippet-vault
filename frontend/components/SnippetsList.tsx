import { Snippet } from "@/types/snippets"
import SnippetsItem from "./SnippetsItem"
import Pagination from "./UI/Pagination"

interface SnippetsListProps {
  snippets: Snippet[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onRemove?: (id: string) => void
  onTagSelect?: (tag: string) => void
}

const SnippetsList: React.FC<SnippetsListProps> = ({
  snippets,
  page,
  totalPages,
  onPageChange,
  onRemove,
  onTagSelect,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {snippets.map(snippet => (
          <SnippetsItem
            key={snippet.id}
            snippet={snippet}
            onRemove={onRemove}
            onTagSelect={onTagSelect}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          handlePageChange={onPageChange}
        />
      )}
    </div>
  )
}

export default SnippetsList
