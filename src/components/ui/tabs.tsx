"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Context para compartir el estado entre los componentes
interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

// Componente principal Tabs
interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  orientation?: "horizontal" | "vertical"
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, children, className, orientation = "horizontal", ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")

    const currentValue = value !== undefined ? value : internalValue
    const handleValueChange = onValueChange || setInternalValue

    const contextValue = React.useMemo(
      () => ({
        value: currentValue,
        onValueChange: handleValueChange,
      }),
      [currentValue, handleValueChange],
    )

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("w-full", orientation === "vertical" && "flex gap-4", className)}
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = "Tabs"

// Lista de pestañas
interface TabsListProps {
  children: React.ReactNode
  className?: string
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsList.displayName = "TabsList"

// Trigger individual de cada pestaña
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactElement | React.ReactNode
  className?: string
  disabled?: boolean
  asChild?: boolean
}

type TabsTriggerChildProps = {
  className?: string
  [key: string]: any
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className, disabled = false, asChild = false, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext()
    const isSelected = selectedValue === value

    const handleClick = () => {
      if (!disabled) {
        onValueChange(value)
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleClick()
      }
    }

    if (asChild && React.isValidElement<TabsTriggerChildProps>(children)) {
      return React.cloneElement(children, {
        role: "tab",
        "aria-selected": isSelected,
        "data-state": isSelected ? "active" : "inactive",
        "data-disabled": disabled ? "" : undefined,
        tabIndex: isSelected ? 0 : -1,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        className: cn(className, children.props.className),
        ...props,
      })
    }

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isSelected}
        data-state={isSelected ? "active" : "inactive"}
        data-disabled={disabled ? "" : undefined}
        tabIndex={isSelected ? 0 : -1}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
          "hover:bg-muted/50",
          className,
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
)
TabsTrigger.displayName = "TabsTrigger"

// Contenido de cada pestaña
interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  forceMount?: boolean
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, children, className, forceMount = false, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext()
    const isSelected = selectedValue === value

    if (!forceMount && !isSelected) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isSelected ? "active" : "inactive"}
        tabIndex={0}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !isSelected && forceMount && "hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
