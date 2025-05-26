"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Filter, CalendarIcon, FileSpreadsheet, FileText } from "lucide-react"
import type { TaskFilters } from "@/types/filters"
import type { User } from "@/types/user"
import { TaskState } from "@/types/task"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TaskFiltersProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  filters: TaskFilters
  setFilters: (filters: TaskFilters) => void
  availableUsers: User[]
  onExportExcel: () => void
  onExportPDF: () => void
  onApplyFilters: (filters: TaskFilters) => void
}

export function TaskFilters({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  availableUsers,
  onExportExcel,
  onExportPDF,
  onApplyFilters,
}: TaskFiltersProps) {
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  const getResponsibleName = (id: number | undefined) => {
    if (id === undefined) return "Seleccionar"
    const user = availableUsers.find(u => u.id === id)
    return user ? `${user.firstName} ${user.lastName}` : "Seleccionar"
  }  

  const getStatusLabel = (states: TaskState[] | undefined) => {
    if (!states) return "Seleccionar"
    const stateStr = states.join(",")
    switch (stateStr) {
      case "PENDING,IN_PROGRESS":
        return "Asignadas"
      case "COMPLETED":
        return "En revisión"
      case "REVIEWED":
        return "Aprobada"
      default:
        return "Seleccionar"
    }
  }

  const clearFilters = () => {
    const emptyFilters: TaskFilters = {
      dateRange: undefined,
      assignedTo: undefined,
      createdBy: undefined,
      state: undefined,
    }
    setFilters(emptyFilters)
    onApplyFilters(emptyFilters)
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
  }

  const handleDateSelect = (date: Date | undefined, field: 'start' | 'end') => {
    if (date) {
      const newDateRange = {
        start: field === 'start' ? date : (filters.dateRange?.start || date),
        end: field === 'end' ? date : (filters.dateRange?.end || date)
      }
      setFilters({
        ...filters,
        dateRange: newDateRange
      })
    } else {
      setFilters({
        ...filters,
        dateRange: undefined
      })
    }
  }

  return (
    <>
      {/* Filter Controls */}
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={16} />
          Filtros
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={onExportExcel}>
            <FileSpreadsheet size={16} />
            Exportar a Excel
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={onExportPDF}>
            <FileText size={16} />
            Exportar a PDF
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-md shadow-sm mb-4">
          <h3 className="text-sm font-medium mb-3">Filtrar tareas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Desde</label>
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.start?.toLocaleDateString() || "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange?.start}
                    onSelect={(date) => {
                      handleDateSelect(date as Date | undefined, 'start')
                      setStartOpen(false)
                    }}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.end?.toLocaleDateString() || "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange?.end}
                    onSelect={(date) => {
                      handleDateSelect(date as Date | undefined, 'end')
                      setEndOpen(false)
                    }}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Responsable</label>
              <Select 
                value={filters.assignedTo?.toString() || ""}
                onValueChange={(value) => {
                  const numValue = value ? Number(value) : undefined
                  const newFilters = { ...filters, assignedTo: numValue }
                  setFilters(newFilters)
                }}
              >
                <SelectTrigger className={cn("w-full", "justify-between")}>
                  <span className="truncate">
                    {filters.assignedTo ? `${availableUsers.find(u => u.id === filters.assignedTo)?.firstName} ${availableUsers.find(u => u.id === filters.assignedTo)?.lastName}` : "Seleccionar"}
                  </span>
                  <SelectValue placeholder="Seleccionar" className="hidden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Seleccionar</SelectItem>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {`${user.firstName} ${user.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Estado</label>
              <Select 
                value={filters.state?.join(",") || ""}
                onValueChange={(value) => {
                  setFilters({ ...filters, state: value ? value.split(",") as TaskState[] : undefined })
                }}
              >
                <SelectTrigger className={cn("w-full", "justify-between")}>
                  <span className="truncate">{getStatusLabel(filters.state)}</span>
                  <SelectValue placeholder="Seleccionar" className="hidden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Seleccionar</SelectItem>
                  <SelectItem value="PENDING,IN_PROGRESS">Asignadas</SelectItem>
                  <SelectItem value="COMPLETED">En revisión</SelectItem>
                  <SelectItem value="REVIEWED">Aprobada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Limpiar
            </Button>
            <Button onClick={handleApplyFilters}>Aplicar</Button>
          </div>
        </div>
      )}
    </>
  )
}
