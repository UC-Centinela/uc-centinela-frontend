"use client"

import { useState, useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { User } from "@/types/user"

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  editAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
  updateRoleAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

export default function EditUserModal({ isOpen, onClose, user, editAction, updateRoleAction }: EditUserModalProps) {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)

  // Función para mapear el rol del usuario al valor del select
  const mapUserRoleToSelectValue = (userRole: string) => {
    switch (userRole) {
      case "roleOperator":
        return "OPERATOR"
      case "roleAdmin":
        return "ADMIN"
      case "roleSuperAdmin":
        return "SUPERADMIN"
      default:
        return "OPERATOR"
    }
  }

  const [role, setRole] = useState(mapUserRoleToSelectValue(user.role))

  const [editState, editFormAction, isEditPending] = useActionState(
    async (_state: { success: boolean; message: string } | null, formData: FormData) => {
      return await editAction(formData)
    },
    null,
  )

  const [roleState, roleFormAction, isRolePending] = useActionState(
    async (_state: { success: boolean; message: string } | null, formData: FormData) => {
      const newFormData = new FormData()
      newFormData.append("userEmail", formData.get("userEmail") as string)
      newFormData.append("role", formData.get("role") as string)
      return await updateRoleAction(newFormData)
    },
    null,
  )

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setRole(mapUserRoleToSelectValue(user.role)) // Mapear correctamente el rol
    }
  }, [user])

  useEffect(() => {
    if (editState?.success || roleState?.success) {
      window.location.reload()
    }
  }, [editState?.success, roleState?.success])

  const handleEditSubmit = (formData: FormData) => {
    editFormAction(formData)
  }

  const handleRoleSubmit = (formData: FormData) => {
    roleFormAction(formData)
  }

  if (!isOpen) return null

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "roleSuperAdmin":
        return "Administrador"
      case "roleAdmin":
        return "Supervisor"
      case "roleOperator":
        return "Operador"
      default:
        return role
    }
  }

  // Comparar correctamente si el rol ha cambiado
  const currentSelectValue = mapUserRoleToSelectValue(user.role)
  const hasRoleChanged = role !== currentSelectValue

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Editar Usuario</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Formulario para editar datos del usuario */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Datos del Usuario</h3>
            <form action={handleEditSubmit} className="space-y-4">
              <input type="hidden" name="email" value={user.email} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Campos ocultos necesarios para la mutation */}
              <input type="hidden" name="role" value={user.role} />
              <input type="hidden" name="customerId" value={user.customerId || ""} />

              {editState && !editState.success && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{editState.message}</div>
              )}

              <Button type="submit" disabled={isEditPending} className="w-full bg-blue-600 hover:bg-blue-700">
                {isEditPending ? "Guardando..." : "Guardar Datos"}
              </Button>
            </form>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200"></div>

          {/* Formulario para cambiar rol */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Cambiar Rol</h3>
            <form action={handleRoleSubmit} className="space-y-4">
              <input type="hidden" name="userEmail" value={user.email} />

              <div>
                <Label htmlFor="role">Rol Actual: {getRoleDisplayName(user.role)}</Label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="OPERATOR">Operador</option>
                  <option value="ADMIN">Supervisor</option>
                  <option value="SUPERADMIN">Administrador</option>
                </select>
              </div>

              {roleState && !roleState.success && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{roleState.message}</div>
              )}

              <Button
                type="submit"
                disabled={isRolePending || !hasRoleChanged}
                className={`w-full ${
                  hasRoleChanged
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                }`}
              >
                {isRolePending ? "Actualizando..." : hasRoleChanged ? "Cambiar Rol" : "Sin cambios"}
              </Button>
            </form>
          </div>

          {/* Mensajes de éxito */}
          {(editState?.success || roleState?.success) && (
            <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
              {editState?.success ? editState.message : roleState?.message}
            </div>
          )}

          {/* Botón para cerrar */}
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
