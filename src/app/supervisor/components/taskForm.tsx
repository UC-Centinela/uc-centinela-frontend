import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import LocationPicker from "@/components/LocationPicker";
import { useState } from "react";

interface TaskFormProps {
  users: User[];
}

export default function TaskForm({ users }: TaskFormProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  } | undefined>();

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }) => {
    console.log('🗺️ [TaskForm] Ubicación seleccionada:', location);
    setSelectedLocation(location);
  };

  const handleLocationClear = () => {
    console.log('🗺️ [TaskForm] Ubicación eliminada');
    setSelectedLocation(undefined);
  };

  // Log del estado actual de la ubicación
  console.log('🗺️ [TaskForm] Estado actual de ubicación:', selectedLocation);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md px-4 md:px-8 py-10">
      <h2 className="text-2xl font-semibold text-[#176170] mb-8">
        Formulario de Tarea
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="assignationDate"
            className="text-[#666666] text-base font-medium"
          >
            Fecha de asignación
          </label>
          <input
            type="date"
            id="assignationDate"
            name="assignationDate"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
            required
          />
        </div>
        {/* Fecha requerida de envío */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="requiredSendDate"
            className="text-[#666666] text-base font-medium"
          >
            Fecha requerida de envío
          </label>
          <input
            type="date"
            id="requiredSendDate"
            name="requiredSendDate"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
            required
          />
        </div>
        {/* Estado */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="state"
            className="text-[#666666] text-base font-medium"
          >
            Estado
          </label>
          <select
            id="state"
            name="state"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
          >
            <option value="">Selecciona un estado</option>
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETED">Completada</option>
            <option value="REVIEWED">Aprobada</option>
          </select>
        </div>
        {/* Título */}
        <div className="flex flex-col gap-2 md:col-span-3">
          <label
            htmlFor="title"
            className="text-[#666666] text-base font-medium"
          >
            Título
          </label>
          <input
            type="text"
            id="title"
            required
            name="title"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
          />
        </div>
        {/* Instrucciones */}
        <div className="flex flex-col gap-2 md:col-span-3">
          <label
            htmlFor="instruction"
            className="text-[#666666] text-base font-medium"
          >
            Instrucciones
          </label>
          <textarea
            id="instruction"
            required
            name="instruction"
            className="border border-gray-300 rounded-lg px-4 py-2 min-h-[80px] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
          />
        </div>
        {/* Responsable */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="creatorUserId"
            className="text-[#666666] text-base font-medium"
          >
            Responsable
          </label>
          <select
            id="creatorUserId"
            name="creatorUserId"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
          >
            <option value="">Selecciona un responsable</option>
            {users
              .filter((user) => user.role === "roleOperator")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
          </select>
        </div>
        {/* Revisor */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="revisorUserId"
            className="text-[#666666] text-base font-medium"
          >
            Revisor
          </label>
          <select
            id="revisorUserId"
            name="revisorUserId"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
          >
            <option value="">Selecciona un revisor</option>
            {users
              .filter((user) => user.role === "roleAdmin")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
          </select>
        </div>
        {/* Comentarios */}
        <div className="flex flex-col gap-2 md:col-span-3">
          <label
            htmlFor="comments"
            className="text-[#666666] text-base font-medium"
          >
            Comentarios
          </label>
          <textarea
            id="comments"
            name="comments"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 min-h-[60px] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176170]"
          />
        </div>
        
        {/* Ubicación */}
        <div className="flex flex-col gap-2 md:col-span-3">
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            onLocationClear={handleLocationClear}
            selectedLocation={selectedLocation}
          />
        </div>
        
        {/* Hidden inputs for location data */}
        {selectedLocation && (
          <>
            <input
              type="hidden"
              name="latitude"
              value={selectedLocation.latitude}
            />
            <input
              type="hidden"
              name="longitude"
              value={selectedLocation.longitude}
            />
            {selectedLocation.title && (
              <input
                type="hidden"
                name="locationTitle"
                value={selectedLocation.title}
              />
            )}
            {selectedLocation.description && (
              <input
                type="hidden"
                name="locationDescription"
                value={selectedLocation.description}
              />
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 md:col-span-3 mt-6">
        <Button type="submit" className="self-start">
          Guardar
        </Button>
      </div>
    </div>
  );
}
