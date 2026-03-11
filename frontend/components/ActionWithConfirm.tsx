import React, { useState } from "react"
import ConfirmationModal, { ConfirmationModalProps } from "./ConfirmationModal"

interface ActionWithConfirmProps {
  children: React.ReactElement<{ onClick?: () => void }>
  confirmModalProps: Omit<
    ConfirmationModalProps,
    "open" | "onConfirm" | "onCancel"
  >
  onConfirm?: () => void
}

const ActionWithConfirm: React.FC<ActionWithConfirmProps> = ({
  children,
  confirmModalProps,
  onConfirm,
}) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => {
    setModalOpen(true)
  }

  const handleConfirm = () => {
    onConfirm?.()
    setModalOpen(false)
  }

  const handleCancel = () => {
    setModalOpen(false)
  }

  return (
    <>
      {React.cloneElement(children, { onClick: handleClick })}
      <ConfirmationModal
        open={modalOpen}
        {...confirmModalProps}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}

export default ActionWithConfirm
