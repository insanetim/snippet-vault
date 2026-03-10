import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError
): string => {
  if ("status" in error) {
    // FetchBaseQueryError
    const fetchError = error as FetchBaseQueryError

    if (fetchError.status === "FETCH_ERROR") {
      return "Network error. Please check your connection."
    }

    if (fetchError.status === "TIMEOUT_ERROR") {
      return "Request timed out. Please try again."
    }

    if (typeof fetchError.status === "number") {
      // HTTP error status
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        return String(fetchError.data.message)
      }

      if (fetchError.data && typeof fetchError.data === "string") {
        return fetchError.data
      }

      // Default HTTP error messages
      switch (fetchError.status) {
        case 400:
          return "Bad request. Please check your input."
        case 401:
          return "Unauthorized. Please log in again."
        case 403:
          return "Forbidden. You do not have permission to perform this action."
        case 404:
          return "Resource not found."
        case 500:
          return "Server error. Please try again later."
        default:
          return `HTTP error ${fetchError.status}.`
      }
    }

    return "An error occurred while fetching data."
  } else {
    // SerializedError
    const serializedError = error as SerializedError

    if (serializedError.message) {
      return serializedError.message
    }

    if (serializedError.code) {
      return `Error code: ${serializedError.code}`
    }

    return "An unexpected error occurred."
  }
}
