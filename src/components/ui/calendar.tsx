"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | { from: Date; to: Date }
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void
  className?: string
  disabled?: (date: Date) => boolean
  locale?: string
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ mode = "single", selected, onSelect, className, disabled, locale = "es-ES", ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()

      const days = []

      // Días del mes anterior
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(year, month, -i)
        days.push({ date: prevDate, isCurrentMonth: false })
      }

      // Días del mes actual
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        days.push({ date, isCurrentMonth: true })
      }

      // Días del mes siguiente para completar la grilla
      const remainingDays = 42 - days.length
      for (let day = 1; day <= remainingDays; day++) {
        const nextDate = new Date(year, month + 1, day)
        days.push({ date: nextDate, isCurrentMonth: false })
      }

      return days
    }

    const isSelected = (date: Date) => {
      if (!selected) return false

      if (mode === "single") {
        return selected instanceof Date && date.toDateString() === selected.toDateString()
      }

      if (mode === "multiple") {
        return Array.isArray(selected) && selected.some((d) => d.toDateString() === date.toDateString())
      }

      if (mode === "range") {
        const range = selected as { from: Date; to: Date }
        return range.from && range.to && date >= range.from && date <= range.to
      }

      return false
    }

    const handleDateClick = (date: Date) => {
      if (disabled && disabled(date)) return

      if (mode === "single") {
        onSelect?.(date)
      } else if (mode === "multiple") {
        const currentSelected = (selected as Date[]) || []
        const isAlreadySelected = currentSelected.some((d) => d.toDateString() === date.toDateString())

        if (isAlreadySelected) {
          onSelect?.(currentSelected.filter((d) => d.toDateString() !== date.toDateString()))
        } else {
          onSelect?.([...currentSelected, date])
        }
      } else if (mode === "range") {
        const range = (selected as { from: Date; to: Date }) || { from: null, to: null }

        if (!range.from || (range.from && range.to)) {
          onSelect?.({ from: date, to: date })
        } else if (range.from && !range.to) {
          if (date < range.from) {
            onSelect?.({ from: date, to: range.from })
          } else {
            onSelect?.({ from: range.from, to: date })
          }
        }
      }
    }

    const navigateMonth = (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newDate = new Date(prev)
        if (direction === "prev") {
          newDate.setMonth(prev.getMonth() - 1)
        } else {
          newDate.setMonth(prev.getMonth() + 1)
        }
        return newDate
      })
    }

    const days = getDaysInMonth(currentMonth)

    return (
      <div ref={ref} className={cn("p-3 bg-white rounded-md border", className)} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigateMonth("prev")} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <h2 className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>

          <button onClick={() => navigateMonth("next")} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-xs font-medium text-center p-2 text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, isCurrentMonth }, index) => {
            const isDisabled = disabled && disabled(date)
            const isSelectedDate = isSelected(date)

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                className={cn(
                  "p-2 text-sm rounded hover:bg-gray-100 transition-colors",
                  !isCurrentMonth && "text-gray-400",
                  isSelectedDate && "bg-primary text-primary-foreground hover:bg-primary/90",
                  isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  },
)
Calendar.displayName = "Calendar"

export { Calendar }
