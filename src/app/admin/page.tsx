import { getUsers, updateUserRole, updateUser, createUser, getUserProfile, removeUserByEmail } from "@/services/users";
import { notFound } from "next/navigation";
import UsersTable from "./components/UsersTable";
import { getTaskByReviewer, getTasksByUser } from "@/services/task";

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
        const userEmail = formData.get("userEmail") as string
        
        // Obtener el usuario actual para verificar su rol
        const users = await getUsers()
        const currentUser = users.find(user => user.email === userEmail)
        
        if (!currentUser) {
            return { success: false, message: 'Usuario no encontrado' }
        }
        
        // Verificar si el usuario tiene tareas asignadas según su rol actual
        let hasTasks = false
        
        if (currentUser.role === "roleOperator") {
            const operatorTasks = await getTasksByUser(Number(currentUser.id))
            hasTasks = operatorTasks.length > 0
        } else if (currentUser.role === "roleAdmin") {
            const supervisorTasks = await getTaskByReviewer(Number(currentUser.id))
            hasTasks = supervisorTasks.length > 0
        }
        
        if (hasTasks) {
            return { 
                success: false, 
                message: `No se puede cambiar el rol del usuario porque tiene tareas asignadas. Por favor, reasigna las tareas antes de cambiar el rol.` 
            }
        }
        
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
        const userEmail = formData.get("email") as string
        
        // Obtener el usuario actual para verificar su rol
        const users = await getUsers()
        const currentUser = users.find(user => user.email === userEmail)
        
        if (!currentUser) {
            return { success: false, message: 'Usuario no encontrado' }
        }
        
        // Verificar si el usuario tiene tareas asignadas según su rol
        let hasTasks = false
        
        if (currentUser.role === "roleOperator") {
            const operatorTasks = await getTasksByUser(Number(currentUser.id))
            hasTasks = operatorTasks.length > 0
        } else if (currentUser.role === "roleAdmin") {
            const supervisorTasks = await getTaskByReviewer(Number(currentUser.id))
            hasTasks = supervisorTasks.length > 0
        }
        
        if (hasTasks) {
            return { 
                success: false, 
                message: `No se puede eliminar el usuario porque tiene tareas asignadas. Por favor, reasigna las tareas antes de eliminar el usuario.` 
            }
        }
        
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
            currentUserId={userId}
            createUserAction={createNewUser}
            editUserAction={changeUserData}
            updateRoleAction={changeUserRole}
            deleteUserAction={deleteUser}
        />
    )
}