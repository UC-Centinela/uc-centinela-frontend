"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText, FileSpreadsheet, AlertCircle, CheckCircle, History } from "lucide-react"
import type { Task, TaskComment, TaskHistoryItem } from "@/types/task"
import type { User } from "@/types/user"

interface TaskDetailsDialogProps {
  task: Task | null
  taskResponsible: User | null
  availableUsers: User[]
  isOpen: boolean
  onClose: () => void
  onExportPDF: (taskId: string) => void
  onExportExcel: (taskId: string) => void
  onReassignResponsible: (taskId: string, newResponsible: number) => void
  onAddComment: (taskId: string, comment: string) => void
}

export function TaskDetailsDialog({
  task,
  taskResponsible,
  availableUsers,
  isOpen,
  onClose,
  onExportPDF,
  onExportExcel,
  onReassignResponsible,
  onAddComment,
}: TaskDetailsDialogProps) {
  if (!task) return null

  const renderStatusBadge = (state: Task["state"]) => {
    switch (state) {
      case "PENDING":
        return <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Asignada</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-[#3b82f6] hover:bg-[#2563eb]">Asignada</Badge>
      case "COMPLETED":
        return <Badge className="bg-[#3b82f6] hover:bg-[#2563eb]">En revisión</Badge>
      case "REVIEWED":
        return <Badge className="bg-[#10b981] hover:bg-[#059669]">Aprobada</Badge>
      default:
        return <Badge className="bg-[#6b7280] hover:bg-[#4b5563]">{state}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Tarea</DialogTitle>
          <DialogDescription>Información completa y opciones para la tarea seleccionada</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Información de la tarea */}
          <div>
            <h3 className="text-lg font-medium mb-4">{task.title}</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Fecha Creación</p>
                <p className="text-sm font-medium">{task.assignationDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fecha Requerida</p>
                <p className="text-sm font-medium">{task.requiredSendDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <div className="mt-1">{renderStatusBadge(task.state)}</div>
              </div>
            </div>

            {/* Responsable con opción de reasignar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Responsable</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      Reasignar
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Reasignar responsable</h4>
                      <Select onValueChange={(value) => onReassignResponsible(task.id, Number(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar nuevo responsable" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.firstName} {user.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {taskResponsible && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                      {taskResponsible.firstName[0]}{taskResponsible.lastName[0]}
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{taskResponsible.firstName} {taskResponsible.lastName}</p>
                    <p className="text-xs text-gray-500">{taskResponsible.role}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exportar reportes */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Exportar Reportes</h4>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => onExportPDF(task.id)}>
                  <FileText size={16} />
                  PDF
                </Button>
                <Button variant="outline" className="flex items-center gap-2" onClick={() => onExportExcel(task.id)}>
                  <FileSpreadsheet size={16} />
                  Excel
                </Button>
              </div>
            </div>
          </div>

          {/* Comentarios e Historial */}
          <div>
            <Tabs defaultValue="comments">
              <TabsList className="w-full">
                <TabsTrigger value="comments" className="flex-1">
                  Comentarios
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  Historial
                </TabsTrigger>
              </TabsList>

              {/* Comentarios */}
              <TabsContent value="comments" className="space-y-4 mt-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm">{comment.comment}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Agregar comentario */}
                <div className="pt-2">
                  <Input 
                    placeholder="Escribe un comentario..." 
                    className="mb-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onAddComment(task.id, e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </TabsContent>

              {/* Historial */}
              <TabsContent value="history" className="space-y-4 mt-4">
                {task.changeHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <History size={16} className="text-gray-500" />
                    <p>{item.action}</p>
                    <span className="text-gray-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
