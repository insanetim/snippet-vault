export interface ConfirmationModalProps {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "warning"
    | "info"
    | "success"
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "primary",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!open) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`btn btn-${confirmButtonColor}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={onCancel}
      />
    </div>
  )
}
