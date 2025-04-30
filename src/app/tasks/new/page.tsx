"use client";
import TaskForm from "@/components/tasks/TaskForm";

export default function NewTaskPage() {
  const handleTaskSubmit = (title: string) => {
    // You could later send it to your backend API
    console.log("Nueva tarea:", title);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <TaskForm onSubmit={handleTaskSubmit} />
    </div>
  );
}