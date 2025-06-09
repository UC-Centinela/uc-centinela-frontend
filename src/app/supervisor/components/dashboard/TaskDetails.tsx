"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar, Clock, FileText, FileSpreadsheet, History, MessageSquare, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"
import type { User as TaskUser } from "@/types/user"
import { updateTask } from "@/services/task"
import { useRouter } from "next/navigation"

interface TaskDetailsDialogProps {
  task: Task | null
  taskResponsible: TaskUser | null
  availableUsers: TaskUser[]
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
  const router = useRouter()
  if (!task) return null

  const renderStatusBadge = (state: Task["state"]) => {
    const statusConfig = {
      PENDING: {
        label: "Asignada",
        className: "bg-amber-500 hover:bg-amber-600 text-white",
      },
      IN_PROGRESS: {
        label: "En progreso",
        className: "bg-blue-500 hover:bg-blue-600 text-white",
      },
      COMPLETED: {
        label: "En revisión",
        className: "bg-violet-500 hover:bg-violet-600 text-white",
      },
      REVIEWED: {
        label: "Aprobada",
        className: "bg-emerald-500 hover:bg-emerald-600 text-white",
      },
      default: {
        label: state,
        className: "bg-gray-500 hover:bg-gray-600 text-white",
      },
    }

    const config = statusConfig[state as keyof typeof statusConfig] || statusConfig.default

    return <Badge className={cn("font-medium", config.className)}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] overflow-y-auto m-2 p-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>

        <DialogHeader className="space-y-1 pr-8">
          <DialogTitle className="text-lg font-bold">{task.title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">{task.instruction}</DialogDescription>
        </DialogHeader>

        {/* Botón Ver ARTP */}
        <div className="flex justify-end mt-4 mb-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
            onClick={() => router.push(`/supervisor/${task.id}/register`)}
          >
            <FileText size={16} className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
            Ver ARTP
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pb-2">
          {/* Información de la tarea */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Fecha Creación</p>
                  <p className="text-sm font-medium">{formatDate(task.assignationDate)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Fecha Requerida</p>
                  <p className="text-sm font-medium">{formatDate(task.requiredSendDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Estado</p>
                  {renderStatusBadge(task.state)}
                </div>
              </div>
            </div>

            {/* Responsable con opción de reasignar */}
            <div className="border rounded-lg p-3 bg-muted/30">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <p className="text-sm font-medium">Responsable</p>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Reasignar
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Reasignar responsable</h4>
                      <Select onValueChange={(value) => onReassignResponsible(task.id, Number(value))}>
                        <SelectTrigger className="w-full">
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
                      <div className="flex justify-end">
                        <Button size="sm" className="mt-2">
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {taskResponsible && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                      {taskResponsible.firstName[0]}
                      {taskResponsible.lastName[0]}
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {taskResponsible.firstName} {taskResponsible.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Exportar reportes */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Exportar Reportes
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 flex-1"
                  onClick={() => onExportPDF(task.id)}
                >
                  <FileText size={16} className="text-rose-500" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 flex-1"
                  onClick={() => onExportExcel(task.id)}
                >
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  Excel
                </Button>
              </div>
            </div>
          </div>

          {/* Comentarios e Historial */}
          <div className="border rounded-lg p-3">
            <Tabs defaultValue="comments" className="w-full">
              <TabsList className="w-full mb-2 grid grid-cols-2">
                <TabsTrigger value="comments" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comentarios
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Historial
                </TabsTrigger>
              </TabsList>

              {/* Comentarios */}
              <TabsContent value="comments" className="space-y-3 mt-2">
                <div className="max-h-[180px] overflow-y-auto pr-2 space-y-3">
                  {task.comments && task.comments.trim() ? (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{task.comments}</p>
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm italic text-center text-muted-foreground">
                        No hay comentarios para mostrar
                      </p>
                    </div>
                  )}
                </div>

                {/* Agregar comentario */}
                <div className="pt-3 border-t">
                  <textarea
                    placeholder="Escribe un comentario..."
                    className="w-full min-h-[80px] max-h-[120px] p-3 text-sm border border-input bg-background rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        onAddComment(task.id, e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement
                        if (textarea && textarea.value.trim()) {
                          onAddComment(task.id, textarea.value)
                          textarea.value = ""
                        }
                      }}
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Historial */}
              <TabsContent value="history" className="space-y-3 mt-2 max-h-[200px] overflow-y-auto">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm italic text-center text-muted-foreground">
                    No hay registros de historial disponibles
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
