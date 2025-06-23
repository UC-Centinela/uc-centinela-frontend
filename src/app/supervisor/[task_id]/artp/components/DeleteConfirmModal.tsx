"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
    title: string
    itemName: string
    type: "tool" | "undesiredEvent" | "control" | "verificationQuestion"
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName,
    type,
}: DeleteConfirmModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    if (!isOpen) return null

    const getItemTypeName = () => {
        switch (type) {
            case "tool":
                return "herramienta"
            case "undesiredEvent":
                return "evento no deseado"
            case "control":
                return "control"
            case "verificationQuestion":
                return "pregunta de verificación"
            default:
                return "elemento"
        }
    }

    const handleConfirm = async () => {
        setIsDeleting(true)
        try {
            await onConfirm()
        } catch (error) {
            console.error("Error deleting item:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h2 className="text-lg font-semibold text-gray-800">Confirmar eliminación</h2>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">¿Seguro que desea eliminar {getItemTypeName()}:</p>
                    <p className="font-semibold text-gray-800 bg-gray-50 p-2 rounded border-l-4 border-red-500">"{itemName}"</p>
                    <p className="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                        {isDeleting ? "Eliminando..." : "Confirmar"}
                    </Button>
                </div>
            </div>
        </div>
    )
}