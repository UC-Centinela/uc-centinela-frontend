import { SupervisorDashboard } from "./components/SupervisorDashboard"
import { getUsers } from "@/services/users"
import { getAllTasks } from "@/services/task"

async function SupervisorPage() {
  const [users, tasks] = await Promise.all([
    getUsers(),
    getAllTasks()
  ])

  return (
    <main>
      <SupervisorDashboard 
        initialTasks={tasks}
        users={users}
      />
    </main>
  )
}

export default SupervisorPage
