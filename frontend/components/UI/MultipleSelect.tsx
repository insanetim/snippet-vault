"use client"

import { ChevronDown, Plus, X } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

interface Option {
  value: string
  label: string
}

interface MultipleSelectProps {
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  allowCustom?: boolean
  customPlaceholder?: string
}

export const MultipleSelect: React.FC<MultipleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className = "",
  allowCustom = true,
  customPlaceholder = "Add custom option...",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredOptions = React.useMemo(() => {
    return options.filter(
      option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(option.value)
    )
  }, [inputValue, options, value])

  const handleSelectOption = (optionValue: string) => {
    const newValue = [...value, optionValue]
    onChange(newValue)
    setInputValue("")
  }

  const handleRemoveValue = (valueToRemove: string) => {
    const newValue = value.filter(v => v !== valueToRemove)
    onChange(newValue)
  }

  const handleAddCustom = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      const newValue = [...value, inputValue.trim()]
      onChange(newValue)
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (allowCustom && inputValue.trim()) {
        handleAddCustom()
      } else if (filteredOptions.length > 0) {
        handleSelectOption(filteredOptions[0].value)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
      setInputValue("")
    }
  }

  const getSelectedLabels = () => {
    return value.map(val => {
      const option = options.find(opt => opt.value === val)
      return option ? option.label : val
    })
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      {/* Selected values display */}
      <div
        className="min-h-10.5 p-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <div className="text-gray-500">{placeholder}</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {getSelectedLabels().map((label, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
              >
                <span>{label}</span>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleRemoveValue(value[index])
                  }}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown
            size={20}
            className="text-gray-400"
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Input field */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={customPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={e => e.stopPropagation()}
              autoFocus
            />
            {allowCustom &&
              inputValue.trim() &&
              !value.includes(inputValue.trim()) && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleAddCustom()
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} />
                  Add &quot;{inputValue.trim()}&quot;
                </button>
              )}
          </div>

          {/* Options list */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                {inputValue ? "No options found" : "No available options"}
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  onClick={e => {
                    e.stopPropagation()
                    handleSelectOption(option.value)
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
