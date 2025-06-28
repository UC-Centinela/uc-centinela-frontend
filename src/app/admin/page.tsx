import { getUsers, updateUserRole, updateUser, createUser, getUserProfile, removeUserByEmail } from "@/services/users";
import { notFound } from "next/navigation";
import UsersTable from "./components/UsersTable";

async function getUsersData() {
    try {
        const users = await getUsers()
        return users || []
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}

async function changeUserRole(formData: FormData) {
    "use server"
    try {
        const result = await updateUserRole(formData)
        if (!result) {
            return { success: false, message: 'Error'}
        }
        if (result.success) {
            return { success: true, message: 'Rol actualizado correctamente' }
        } else {
          return { success: false, message: result.error || "Error al actualizar el rol" }
        }
    } catch (error) {
        console.error("Error updating user role:", error)
        return { success: false, message: "Error al actualizar el rol" }
    }
}

async function changeUserData(formData: FormData) {
    "use server"
    try {
        const result = await updateUser(formData)
        if (!result) {
            return { success: false, message: 'Error'}
        }
        if (result.success) {
            return { success: true, message: 'Usuario actualizado correctamente' }
        } else {
          return { success: false, message: result.error || "Error al actualizar el usuario" }
        }
    } catch (error) {
        console.error("Error updating user:", error)
        return { success: false, message: "Error al actualizar el usuario" }
    }
}

async function createNewUser(formData: FormData) {
    "use server"
    try {
        const result = await createUser(formData)
        if (!result) {
            return { success: false, message: 'Error'}
        }
        if (result.success) {
            return { success: true, message: 'Usuario creado correctamente' }
        } else {
          return { success: false, message: result.error || "Error al crear el usuario" }
        }
    } catch (error) {
        console.error("Error creating user:", error)
        return { success: false, message: "Error al crear el usuario" }
    }
}

async function deleteUser(formData: FormData) {
    "use server"
    try {
        const result = await removeUserByEmail(formData)
        if (!result) {
            return { success: false, message: 'Error'}
        }
        if (result.success) {
            return { success: true, message: 'Usuario eliminado correctamente' }
        } else {
          return { success: false, message: result.error || "Error al eliminar el usuario" }
        }
    } catch (error) {
        console.error("Error removing user:", error)
        return { success: false, message: "Error al eliminar el usuario" }
    }
}

export default async function AdminPage() {
    const userProfile = await getUserProfile()
    const userId = userProfile?.data?.getUserByEmail?.id;
    if (!userId) {
        notFound() 
    }
    const users = await getUsersData()
    return (
        <UsersTable
            users={users}
            createUserAction={createNewUser}
            editUserAction={changeUserData}
            updateRoleAction={changeUserRole}
            deleteUserAction={deleteUser}
        />
    )
}