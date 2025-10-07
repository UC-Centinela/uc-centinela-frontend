"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  FileText,
  X,
  MessageSquare,
  User,
  Edit,
  Shield,
} from "lucide-react";
import type { Task, TaskState } from "@/types/task";
import type { User as TaskUser } from "@/types/user";
import { useState, useEffect } from "react";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface TaskDetailsDialogProps {
  task: Task | null;
  taskResponsible: TaskUser | null;
  availableUsers: TaskUser[];
  isOpen: boolean;
  onClose: () => void;
  onSaveChanges: (
    taskId: string,
    data: {
      creatorUserId: number;
      revisorUserId: number;
      comments: string;
      title: string;
      instruction: string;
      state: TaskState;
      assignationDate: string;
      requiredSendDate: string;
    }
  ) => void;
}

export function TaskDetailsDialog({
  task,
  taskResponsible,
  availableUsers,
  isOpen,
  onClose,
  onSaveChanges,
}: TaskDetailsDialogProps) {
  const { push: pushWithLoading } = useRouterLoading();
  const [comment, setComment] = useState(task?.comments || "");
  const [selectedResponsibleId, setSelectedResponsibleId] = useState<
    number | null
  >(null);
  const [selectedResponsibleName, setSelectedResponsibleName] = useState<
    string | null
  >(null);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<
    number | null
  >(null);
  const [selectedSupervisorName, setSelectedSupervisorName] = useState<
    string | null
  >(null);
  const [isReassigning, setIsReassigning] = useState(false);
  const [isReassigningSupervisor, setIsReassigningSupervisor] = useState(false);
  const [title, setTitle] = useState(task?.title || "");
  const [instruction, setInstruction] = useState(task?.instruction || "");
  const [state, setState] = useState(task?.state || "PENDING");
  const [assignationDate, setAssignationDate] = useState(
    task?.assignationDate || ""
  );
  const [requiredSendDate, setRequiredSendDate] = useState(
    task?.requiredSendDate || ""
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  useEffect(() => {
    setComment(task?.comments || "");
    setSelectedResponsibleId(null);
    setSelectedSupervisorId(null);
    setTitle(task?.title || "");
    setInstruction(task?.instruction || "");
    setState(task?.state || "PENDING");
    setAssignationDate(task?.assignationDate || "");
    setRequiredSendDate(task?.requiredSendDate || "");
    setIsEditingTitle(false);
    setIsEditingInstruction(false);
    setIsEditingDate(false);
  }, [task]);

  if (!task) return null;

  // Obtener el supervisor actual de la tarea
  const currentSupervisor = availableUsers.find(
    (user) => user.id === task.revisorUserId
  );

  const handleReassign = (userId: string) => {
    if (userId) {
      const selectedUser = availableUsers.find(
        (user) => user.id.toString() === userId
      );

      // Verificar que el usuario seleccionado sea un operador
      if (selectedUser && selectedUser.role === "roleOperator") {
        setSelectedResponsibleName(
          selectedUser.firstName + " " + selectedUser.lastName
        );
        setSelectedResponsibleId(Number(userId));
        setIsReassigning(false);
      }
    }
  };

  const handleReassignSupervisor = (userId: string) => {
    if (userId) {
      const selectedUser = availableUsers.find(
        (user) => user.id.toString() === userId
      );

      // Verificar que el usuario seleccionado sea un supervisor
      if (selectedUser && selectedUser.role === "roleAdmin") {
        setSelectedSupervisorName(
          selectedUser.firstName + " " + selectedUser.lastName
        );
        setSelectedSupervisorId(Number(userId));
        setIsReassigningSupervisor(false);
      }
    }
  };

  const renderStatusBadge = (state: Task["state"]) => {
    switch (state) {
      case "PENDING":
        return (
          <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Asignada</Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Asignada</Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-[#3b82f6] hover:bg-[#2563eb]">En revisión</Badge>
        );
      case "REVIEWED":
        return (
          <Badge className="bg-[#10b981] hover:bg-[#059669]">Aprobada</Badge>
        );
      case "IS_REJECTED":
        return (
          <Badge className="bg-[#ef4444] hover:bg-[#b91c1c]">Rechazada</Badge>
        );
      default:
        return (
          <Badge className="bg-[#6b7280] hover:bg-[#4b5563]">{state}</Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const isResponsibleNew =
    selectedResponsibleId &&
    selectedResponsibleId.toString() !== taskResponsible?.id.toString();

  const isSupervisorNew =
    selectedSupervisorId &&
    selectedSupervisorId.toString() !== task.revisorUserId.toString();

  const hasChanges =
    comment.trim() !== task.comments ||
    isResponsibleNew ||
    isSupervisorNew ||
    title !== task.title ||
    instruction !== task.instruction ||
    requiredSendDate !== task.requiredSendDate;

  const isReadOnly = task.state === "REVIEWED" || task.state === "IS_REJECTED";
  const readOnlyReason = task.state === "REVIEWED"
    ? "porque la tarea ya fue aprobada."
    : task.state === "IS_REJECTED"
    ? "porque la tarea fue rechazada."
    : "por su estado actual.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <div className="bg-white h-[80vh] overflow-y-auto p-6 space-y-6">
          <div className="flex items-start justify-between pb-4 border-b">
            <DialogHeader className="flex-1 pr-8">
              {isEditingTitle ? (
                <div className="space-y-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-2 border-blue-300 focus:border-blue-500"
                    placeholder="Título de la tarea"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setIsEditingTitle(false)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTitle(task.title || "");
                        setIsEditingTitle(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {title}
                  </DialogTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isEditingInstruction ? (
                <div className="space-y-2">
                  <textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="w-full p-3 text-base border-2 border-blue-300 focus:border-blue-500 rounded-lg resize-none"
                    placeholder="Instrucciones de la tarea"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setIsEditingInstruction(false)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setInstruction(task.instruction || "");
                        setIsEditingInstruction(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <DialogDescription className="text-base leading-relaxed mt-3 text-gray-600 flex-1">
                    {instruction}
                  </DialogDescription>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingInstruction(true)}
                    className="p-1 hover:bg-gray-100 mt-3"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </DialogHeader>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              size="lg"
              onClick={() => {
                const responsibleId =
                  selectedResponsibleId || taskResponsible?.id || 0;
                const supervisorId =
                  selectedSupervisorId || task.revisorUserId || 0;
                onSaveChanges(task.id, {
                  creatorUserId: responsibleId,
                  revisorUserId: supervisorId,
                  comments: comment.trim(),
                  title: title,
                  instruction: instruction,
                  state: state,
                  assignationDate: assignationDate,
                  requiredSendDate: requiredSendDate,
                });
                setSelectedResponsibleId(null);
                setSelectedSupervisorId(null);
                window.location.reload();
              }}
              disabled={!hasChanges || isReadOnly}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-200"
            >
              Guardar Cambios
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-3 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 px-6 py-3"
              onClick={() => pushWithLoading(`/supervisor/${task.id}/register`)}
            >
              <FileText size={18} className="text-blue-600" />
              Ver Registro
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Left Column - Task Info */}
            <div className="space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  Información de la Tarea
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Fecha Creación
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatDate(task.assignationDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-amber-50 rounded-lg flex-shrink-0">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Fecha Requerida
                      </p>
                      {isEditingDate ? (
                        <div className="space-y-2">
                          <Input
                            type="date"
                            value={formatDateForInput(requiredSendDate)}
                            onChange={(e) =>
                              setRequiredSendDate(e.target.value)
                            }
                            className="border-2 border-blue-300 focus:border-blue-500"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setIsEditingDate(false)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRequiredSendDate(
                                  task.requiredSendDate || ""
                                );
                                setIsEditingDate(false);
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-gray-900">
                            {formatDate(requiredSendDate)}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditingDate(true)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                      <div className="h-5 w-5 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-gray-400" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Estado
                      </p>
                      {renderStatusBadge(task.state)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsible Person Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Responsable
                </h3>

                <div className="space-y-4">
                  {taskResponsible && (
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm flex-shrink-0">
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                          {taskResponsible.firstName[0]}
                          {taskResponsible.lastName[0]}
                        </div>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {taskResponsible.firstName} {taskResponsible.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Responsable actual
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedResponsibleId && isResponsibleNew && (
                    <div className="flex items-center gap-4 p-4 border border-green-300 rounded-lg bg-green-50/50">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm flex-shrink-0">
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold text-sm">
                          {
                            availableUsers.find(
                              (user) => user.id === selectedResponsibleId
                            )?.firstName[0]
                          }
                          {
                            availableUsers.find(
                              (user) => user.id === selectedResponsibleId
                            )?.lastName[0]
                          }
                        </div>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {
                            availableUsers.find(
                              (user) => user.id === selectedResponsibleId
                            )?.firstName
                          }{" "}
                          {
                            availableUsers.find(
                              (user) => user.id === selectedResponsibleId
                            )?.lastName
                          }
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Nuevo Responsable: {selectedResponsibleName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reassign Section */}
                  <div className="space-y-3">
                    {isReadOnly ? (
                      <div className="text-gray-500 text-sm italic">No se puede reasignar el responsable {readOnlyReason}</div>
                    ) : !isReassigning ? (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsReassigning(true)}
                        className="w-full flex items-center gap-3 py-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                      >
                        <User className="h-4 w-4" />
                        Reasignar Responsable
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-900">
                              Seleccionar nuevo responsable
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReassigning(false)}
                            className="hover:bg-blue-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="relative">
                          <Select onValueChange={handleReassign}>
                            <SelectTrigger className="w-full h-12 text-left">
                              <SelectValue placeholder="Seleccionar responsable" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[250px] overflow-y-auto z-[9999] w-full mr-4">
                              {availableUsers
                                .filter((user) => user.role === "roleOperator")
                                .map((user) => (
                                  <SelectItem
                                    key={user.id}
                                    value={user.id.toString()}
                                    className="py-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                      </div>
                                      <span className="font-medium">
                                        {user.firstName} {user.lastName}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Supervisor Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  Supervisor
                </h3>

                <div className="space-y-4">
                  {currentSupervisor && (
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm flex-shrink-0">
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-sm">
                          {currentSupervisor.firstName[0]}
                          {currentSupervisor.lastName[0]}
                        </div>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {currentSupervisor.firstName} {currentSupervisor.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Supervisor actual
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedSupervisorId && isSupervisorNew && (
                    <div className="flex items-center gap-4 p-4 border border-purple-300 rounded-lg bg-purple-50/50">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm flex-shrink-0">
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-sm">
                          {
                            availableUsers.find(
                              (user) => user.id === selectedSupervisorId
                            )?.firstName[0]
                          }
                          {
                            availableUsers.find(
                              (user) => user.id === selectedSupervisorId
                            )?.lastName[0]
                          }
                        </div>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {
                            availableUsers.find(
                              (user) => user.id === selectedSupervisorId
                            )?.firstName
                          }{" "}
                          {
                            availableUsers.find(
                              (user) => user.id === selectedSupervisorId
                            )?.lastName
                          }
                        </p>
                        <p className="text-sm text-purple-600 font-medium">
                          Nuevo Supervisor: {selectedSupervisorName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reassign Supervisor Section */}
                  <div className="space-y-3">
                    {isReadOnly ? (
                      <div className="text-gray-500 text-sm italic">No se puede reasignar el supervisor {readOnlyReason}</div>
                    ) : !isReassigningSupervisor ? (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsReassigningSupervisor(true)}
                        className="w-full flex items-center gap-3 py-3 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200"
                      >
                        <Shield className="h-4 w-4" />
                        Reasignar Supervisor
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-purple-50/50">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-purple-600" />
                            <p className="text-sm font-medium text-purple-900">
                              Seleccionar nuevo supervisor
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReassigningSupervisor(false)}
                            className="hover:bg-purple-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="relative">
                          <Select onValueChange={handleReassignSupervisor}>
                            <SelectTrigger className="w-full h-12 text-left">
                              <SelectValue placeholder="Seleccionar supervisor" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[250px] overflow-y-auto z-[9999] w-full mr-4">
                              {availableUsers
                                .filter((user) => user.role === "roleAdmin")
                                .map((user) => (
                                  <SelectItem
                                    key={user.id}
                                    value={user.id.toString()}
                                    className="py-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                      </div>
                                      <span className="font-medium">
                                        {user.firstName} {user.lastName}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Comments */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Comentarios
                  </h3>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe un comentario sobre esta tarea..."
                    className="w-full h-[350px] max-h-[350px] p-4 text-base border border-gray-300 bg-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 overflow-y-auto"
                    onKeyDown={(e) => {
                      // Solo permitir Enter para nuevas líneas, no para guardar
                      if (e.key === "Enter" && !e.shiftKey) {
                        // No hacer nada, permitir el comportamiento normal de nueva línea
                      }
                    }}
                    disabled={isReadOnly}
                  />
                  {isReadOnly && (
                    <div className="text-gray-500 text-sm italic mt-2">No se pueden editar los comentarios {readOnlyReason}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
