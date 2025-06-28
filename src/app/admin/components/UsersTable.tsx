"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Edit, Users, Delete } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreateUserModal from "./CreateUserModal"
import EditUserModal from "./EditUserModal"
import DeleteUserModal from "./DeleteUserModal"
import type { User } from "@/types/user"

interface UsersTableProps {
    users: User[]
    createUserAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    editUserAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    updateRoleAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    deleteUserAction: (FormData: FormData) => Promise<{ success: boolean; message: string }>
}

interface CreateModalState {
    isOpen: boolean
}

interface EditModalState {
    isOpen: boolean
    user: User | null
}

interface DeleteModalState {
    isOpen: boolean
    user: User | null
}

export default function UsersTable({ users, createUserAction, editUserAction, updateRoleAction, deleteUserAction }: UsersTableProps) {
    const router = useRouter()

    const [createModal, setCreateModal] = useState<CreateModalState>({
        isOpen: false,
    })

    const [editModal, setEditModal] = useState<EditModalState>({
        isOpen: false,
        user: null,
    })

    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        isOpen: false,
        user: null,
    })

    const handleCreateUser = () => {
        setCreateModal({ isOpen: true })
    }

    const handleEditUser = (user: User) => {
        setEditModal({ isOpen: true, user })
    }

    const handleDeleteUser = (user: User) => {
        setDeleteModal({ isOpen: true, user })
    }

    const closeCreateModal = () => {
        setCreateModal({ isOpen: false })
    }

    const closeEditModal = () => {
        setEditModal({ isOpen: false, user: null })
    }

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, user: null })
    }

    const getRoleDisplayName = (role: string) => {
        switch (role) {
        case "roleAdmin":
            return "Supervisor"
        case "roleSuperAdmin":
            return "Administrador"
        case "roleOperator":
            return "Operador"
        default:
            return role
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "roleAdmin":
            return "bg-blue-100 text-blue-800"; // Supervisor
            case "roleSuperAdmin":
            return "bg-red-100 text-red-800"; // Administrador
            case "roleOperator":
            return "bg-green-100 text-green-800"; // Operador
            default:
            return "bg-gray-100 text-gray-800"; // Desconocido
        }
    }

    const sortedUsers = [...users].sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
    })

    return (
        <div className="min-h-screen bg-gray-100 pb-6">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm">
                <Button variant="ghost" onClick={() => router.back()} className="text-red-500 mb-2">
                    <ChevronLeft className="h-5 w-5 mr-1" /> Volver
                </Button>

                <div className="flex items-center justify-between mb-6 mt-4">
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-teal-700" />
                        <h1 className="text-2xl font-bold text-teal-800">Administración de Usuarios</h1>
                    </div>
                    <Button onClick={handleCreateUser} className="bg-teal-700 hover:bg-teal-800 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Usuario
                    </Button>
                </div>
            </div>

            <div className="px-6 py-6">
                {/* Tabla de usuarios */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Lista de Usuarios ({users.length})</h2>
                    </div>

                    {users.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No se encontraron usuarios</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            RUT
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-teal-700">
                                                            {user.firstName.charAt(0).toUpperCase()}
                                                            {user.lastName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-900">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-900">{user.rut}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                                                        user.role,
                                                    )}`}
                                                >
                                                    {getRoleDisplayName(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditUser(user)}
                                                    className="border-blue-500 text-blue-600 hover:bg-blue-50 px-3 py-1 text-xs bg-transparent"
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="border-red-500 text-red-600 hover:bg-red-50 px-3 py-1 text-xs bg-transparent ml-2"
                                                >
                                                    <Delete className="h-3 w-3 mr-1" />
                                                    Borrar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modales */}
            {createModal.isOpen && (
                <CreateUserModal isOpen={createModal.isOpen} onClose={closeCreateModal} action={createUserAction} />
            )}

            {editModal.isOpen && editModal.user && (
                <EditUserModal
                    isOpen={editModal.isOpen}
                    onClose={closeEditModal}
                    user={editModal.user}
                    editAction={editUserAction}
                    updateRoleAction={updateRoleAction}
                />
            )}

            {deleteModal.isOpen && deleteModal.user && (
                <DeleteUserModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    user={deleteModal.user}
                    deleteAction={deleteUserAction}
                />
            )}
        </div>
    )
}