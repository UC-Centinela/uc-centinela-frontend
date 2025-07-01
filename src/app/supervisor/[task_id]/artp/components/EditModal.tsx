"use client"

import { useEffect, useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { Tools, UndesiredEvent, Control, VerificationQuestion } from "@/types/task"

type EditableItem = Tools | UndesiredEvent | Control | VerificationQuestion

interface EditModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    item: EditableItem
    taskId: string
    action: (formData: FormData) => Promise<{ success: boolean; message: string }>
    type: "tool" | "undesiredEvent" | "control" | "verificationQuestion"
}

export default function EditModal({ isOpen, onClose, title, item, taskId, action, type }: EditModalProps) {
    const [itemTitle, setItemTitle] = useState(item.title)
    const [itemDescription, setItemDescription] = useState('description' in item ? item.description || "" : "")
    const [state, formAction, isPending] = useActionState(
        async (_state: { success: boolean; message: string } | null, formData: FormData) => {
            return await action(formData)
        },
        null
    )

    useEffect(() => {
        if (state?.success) {
            const timeout = setTimeout(() => {
                onClose()
            }, 0)
            return () => clearTimeout(timeout)
        }
    }, [state, onClose])

    if (!isOpen) return null

    const handleSubmit = (formData: FormData) => {
        formAction(formData);
    }

    const getFieldName = () => {
        switch (type) {
            case 'tool':
                return 'toolId'
            case 'undesiredEvent':
                return 'eventId'
            case 'control':
                return 'controlId'
            case 'verificationQuestion':
                return 'questionId'
            default:
                return 'id'
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <input type="hidden" name={getFieldName()} value={item.id} />
                    <input type="hidden" name="taskId" value={taskId} />

                    <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            name="title"
                            value={itemTitle}
                            onChange={(e) => setItemTitle(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>

                    {type !== "tool" && (
                        <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    )}

                    {state && !state.success && <div className="text-red-600 text-sm">{state.message}</div>}

                    {state && state.success && <div className="text-green-600 text-sm">{state.message}</div>}

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                            {isPending ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}