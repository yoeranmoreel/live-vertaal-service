import * as React from "react"
import { ChevronDown } from "lucide-react"

const SelectContext = React.createContext()

const Select = ({ value, onValueChange, children, disabled = false }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, disabled }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const { open, setOpen, disabled } = React.useContext(SelectContext)
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => !disabled && setOpen(!open)}
      disabled={disabled}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext)
  const [displayValue, setDisplayValue] = React.useState(placeholder)
  
  React.useEffect(() => {
    if (!value) {
      setDisplayValue(placeholder)
    }
  }, [value, placeholder])
  
  return <span>{displayValue || placeholder}</span>
}

const SelectContent = ({ className = "", children }) => {
  const { open, setOpen } = React.useContext(SelectContext)
  const contentRef = React.useRef()
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])
  
  if (!open) return null
  
  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  )
}

const SelectItem = ({ value, children, className = "", ...props }) => {
  const context = React.useContext(SelectContext)
  
  const handleSelect = () => {
    context.onValueChange(value)
    context.setOpen(false)
  }
  
  const isSelected = context.value === value
  
  return (
    <div
      onClick={handleSelect}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${isSelected ? 'bg-gray-100 font-medium' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
