import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  handlePageChange: (page: number) => void
}

const Pagination = ({
  page,
  totalPages,
  handlePageChange,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push("...")
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {/* Previous button */}
        <button
          className="join-item btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {getVisiblePages().map((pageNum, index) => (
          <button
            key={index}
            className={`join-item btn ${pageNum === page ? "btn-active" : ""}`}
            onClick={() => {
              if (typeof pageNum === "number") {
                handlePageChange(pageNum)
              }
            }}
            disabled={typeof pageNum !== "number"}
          >
            {pageNum}
          </button>
        ))}

        {/* Next button */}
        <button
          className="join-item btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
