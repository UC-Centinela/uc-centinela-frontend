"use client";

interface TaskIntroProps {
  onStart: () => void;
}

export default function TaskIntro({ onStart }: TaskIntroProps) {
  return (
    <div className="flex flex-col justify-between min-h-screen p-4 bg-white max-w-md mx-auto">
      <div>
        <div className="bg-gray-100">
          <button className="text-sm text-red-600 mb-2">&larr; Volver a Tareas Asignadas</button>

          <h1 className="text-xl font-bold text-gray-800">
            Posicionamiento de cable minero eléctrico sobre el pretil utilizando equipo de apoyo
          </h1>
        </div>
        <p className="mt-2 text-gray-700">
          Realiza el Análisis de Riesgo para completar la información acerca de la tarea.
        </p>

        <h2 className="mt-4 font-bold text-lg text-teal-800">Son solo 3 pasos:</h2>

        <ul className="mt-2 space-y-4">
          {[
            "Registra las actividades y el entorno de la tarea",
            "Revisa y/o edita la propuesta de controles de riesgo ARTP",
            "Envía la propuesta de ARTP para su revisión",
          ].map((step, i) => (
            <li key={i} className="flex items-start p-3 bg-gray-100 rounded-lg shadow-sm">
              <div className="mr-3 text-teal-700 font-bold">{i + 1}.</div>
              <p className="text-sm text-gray-800">{step}</p>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onStart}
        className="mt-6 w-full bg-teal-800 text-white py-3 rounded-md shadow-md"
      >
        Comenzar Análisis de Riesgo
      </button>
    </div>
  );
}