import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BackButtonProps {
  title?: string
  href?: string
}

const BackButton: React.FC<BackButtonProps> = ({
  title = "Back",
  href = "/",
}) => {
  return (
    <div className="mb-4">
      <Link
        href={href}
        className="btn btn-ghost btn-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {title}
      </Link>
    </div>
  )
}

export default BackButton
