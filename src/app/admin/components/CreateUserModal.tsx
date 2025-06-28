"use client"

import { useState, useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  action: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

export default function CreateUserModal({ isOpen, onClose, action }: CreateUserModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [rut, setRut] = useState("")
  const [role, setRole] = useState("roleOperator")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [rutError, setRutError] = useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(
    async (_state: { success: boolean; message: string } | null, formData: FormData) => {
        return await action(formData)
    },
    null
  )

  useEffect(() => {
    if (state?.success) {
      window.location.reload()
    }
  }, [state])

  const validateRut = (rut: string): { valid: boolean; error?: string } => {
    if (!rut) {
        return { valid: false, error: "El RUT no puede estar vacío" }
    }
    const cleanRut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase()
    if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) {
        return { valid: false, error: "El RUT tiene un formato inválido. Usa el formato 12345678-9" }
    }

    const body = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1).toUpperCase()

    let sum = 0
    let multiple = 2

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiple
      multiple = multiple < 7 ? multiple + 1 : 2
    }

    const correctDv = 11 - (sum % 11)
    const calculatedDv = correctDv === 11 ? "0" : correctDv === 10 ? "K" : correctDv.toString()

    if (dv !== calculatedDv) {
        return { valid: false, error: "El RUT ingresado no es válido" }
    }

    return { valid: true }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (formData: FormData) => {
    const rutValue = formData.get("rut") as string
    const emailValue = formData.get("email") as string

    const { valid: validRut, error: rutError } = validateRut(rutValue)
    const validEmail = validateEmail(emailValue)

    setRutError(!validRut ? rutError || "RUT inválido" : null)
    setEmailError(!validEmail ? "Correo electrónico inválido" : null)

    if (!validRut || !validEmail) return

    formAction(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Crear Nuevo Usuario</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form action={handleSubmit} className="space-y-4">
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
                placeholder="Nombre"
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
                placeholder="Apellido"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="usuario@ejemplo.com"
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <Label htmlFor="rut">RUT</Label>
            <Input
              id="rut"
              name="rut"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
              className="mt-1"
              placeholder="12345678-9"
            />
            {rutError && <p className="text-red-600 text-sm mt-1">{rutError}</p>}
          </div>

          <div>
            <Label htmlFor="role">Rol</Label>
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

          <input type="hidden" name="customerId" value="1" />

          {state && !state.success && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{state.message}</div>}

          {state && state.success && (
            <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{state.message}</div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-teal-700 hover:bg-teal-800">
              {isPending ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

