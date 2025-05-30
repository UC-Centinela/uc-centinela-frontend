export default function ARTPResult({ params }: { params: { task_id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-teal-800">
        Resultado ARTP de tarea {params.task_id}
      </h1>
    </div>
  );
} 