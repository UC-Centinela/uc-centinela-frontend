"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types/task"
import type { User } from "@/types/user"

interface TaskTableProps {
  tasks: Task[]
  users: User[]
  onViewDetails: (task: Task) => void
  onExportPDF: (taskId: string) => void
  onExportExcel: (taskId: string) => void
}

export function TaskTable({ tasks, users }: TaskTableProps) {
  const renderStatusBadge = (state: Task["state"]) => {
    switch (state) {
      case "PENDING":
        return <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Asignada</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Asignada</Badge>
      case "COMPLETED":
        return <Badge className="bg-[#3b82f6] hover:bg-[#2563eb]">En revisión</Badge>
      case "REVIEWED":
        return <Badge className="bg-[#10b981] hover:bg-[#059669]">Aprobada</Badge>
      default:
        return <Badge className="bg-[#6b7280] hover:bg-[#4b5563]">{state}</Badge>
    }
  }

  const getUserName = (userId: number) => {
    const user = users.find(u => {
      return String(u.id) === String(userId)
    })
    return user ? `${user.firstName} ${user.lastName}` : 'Usuario no encontrado'
  }  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Título</TableHead>
            <TableHead>Fecha Asignación</TableHead>
            <TableHead>Fecha Requerida</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Revisor</TableHead>
            {/* <TableHead className="text-right">Acciones</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>{formatDate(task.assignationDate)}</TableCell>
              <TableCell>{formatDate(task.requiredSendDate)}</TableCell>
              <TableCell>{renderStatusBadge(task.state)}</TableCell>
              <TableCell>{getUserName(task.creatorUserId)}</TableCell>
              <TableCell>{getUserName(task.revisorUserId)}</TableCell>
              {/* <TableCell>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onViewDetails(task)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onExportPDF(task.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onExportExcel(task.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
