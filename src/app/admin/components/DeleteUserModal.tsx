"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { User } from "@/types/user"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  deleteAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

export default function DeleteUserModal({ isOpen, onClose, user, deleteAction }: DeleteModalProps) {
    const [state, formAction, isPending] = useActionState(
        async (_state: { success: boolean; message: string } | null, formData: FormData) => {
            return await deleteAction(formData)
        },
        null
    )

    useEffect(() => {
        if (state?.success) {
            window.location.reload()
        }
    }, [state])

    if (!isOpen) return null

    const handleSubmit = (formData: FormData) => {
        formAction(formData)
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Confirmar Eliminación</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <input type="hidden" name="email" value={user.email} />

                    <p className="text-gray-700">
                        ¿Estás seguro que deseas eliminar al usuario{" "}
                        <strong>{user.firstName} {user.lastName}</strong> ({user.email})?
                        Esta acción no se puede deshacer.
                    </p>

                    {state && !state.success && (
                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{state.message}</div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-red-600 hover:bg-red-700">
                            {isPending ? "Eliminando..." : "Eliminar Usuario"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}