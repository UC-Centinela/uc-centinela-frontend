import { getUsers, updateUserRole } from "@/services/users";
import { notFound } from "next/navigation";

async function getUsersData() {
    try {
        const users = await getUsers()
        return users || []
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}