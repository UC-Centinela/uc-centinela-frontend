import Link from 'next/link';

export default function TaskNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tarea no encontrada</h2>
        <p className="text-gray-600 mb-8">
          La tarea que estás buscando no existe o no tiene un formato válido.
        </p>
        <Link 
          href="/tasks" 
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
        >
          Volver a tareas
        </Link>
      </div>
    </div>
  );
}
