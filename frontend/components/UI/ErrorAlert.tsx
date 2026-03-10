interface ErrorAlertProps {
  errorMessage: string | string[]
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ errorMessage }) => {
  const renderError = () => {
    if (Array.isArray(errorMessage)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {errorMessage.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )
    }

    return <span>{errorMessage}</span>
  }

  return (
    <div
      role="alert"
      className="alert alert-error alert-soft p-4"
    >
      {renderError()}
    </div>
  )
}

export default ErrorAlert
