"use client";

import { useState } from "react";

interface TaskFormProps {
  onSubmit: (title: string) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }

    setError("");
    onSubmit(title.trim());
    setTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Crear Nueva Tarea</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título de la Tarea
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          placeholder="Ej: Inspección de maquinaria en zona 5"
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 transition"
      >
        Crear Tarea
      </button>
    </form>
  );
}