"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlStrategy {
  id: string;
  name: string;
}

interface ControlStrategySelectorProps {
  onClose: () => void;
  onConfirm: (selectedStrategies: ControlStrategy[]) => void;
  suggestedStrategies?: ControlStrategy[];
}

export default function ControlStrategySelector({
  onClose,
  onConfirm,
  suggestedStrategies = []
}: ControlStrategySelectorProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<ControlStrategy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [removedSuggestions, setRemovedSuggestions] = useState<string[]>([]);

  // Initialize selected strategies with suggested ones
  useEffect(() => {
    setSelectedStrategies(suggestedStrategies);
  }, [suggestedStrategies]);

  // This would be replaced with actual data from your backend
  const mockStrategies: ControlStrategy[] = [
    { id: "1", name: "Operación de Vehículos Livianos" },
    { id: "2", name: "Operación de Equipos Pesados" },
    { id: "3", name: "Operaciones de Izaje" },
    { id: "4", name: "Trabajos en Altura" },
    { id: "5", name: "Interacción con Partes Móviles" },
    { id: "6", name: "Operación y Mantención Correas Transportadoras" },
    { id: "7", name: "Trabajos en Espacios Confinados" },
    { id: "8", name: "Interacción con Energía Eléctrica" },
    { id: "9", name: "Interacción con Energía Hidráulica" },
    { id: "10", name: "Construcción y Operación de Taludes" },
  ];

  const handleSuggestionRemove = (strategy: ControlStrategy) => {
    setRemovedSuggestions(prev => [...prev, strategy.id]);
    setSelectedStrategies(prev => prev.filter(s => s.id !== strategy.id));
  };

  const handleSuggestionAdd = (strategy: ControlStrategy) => {
    setRemovedSuggestions(prev => prev.filter(id => id !== strategy.id));
    setSelectedStrategies(prev => [...prev, strategy]);
  };

  const handleStrategyToggle = (strategy: ControlStrategy) => {
    setSelectedStrategies(prev => {
      const isSelected = prev.some(s => s.id === strategy.id);
      if (isSelected) {
        return prev.filter(s => s.id !== strategy.id);
      } else {
        return [...prev, strategy];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedStrategies);
    onClose();
  };

  const filteredStrategies = mockStrategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white z-50">
      <Button
        variant="ghost"
        onClick={onClose}
        className="text-red-500 absolute top-4 left-4"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Volver
      </Button>

      <div className="p-4 pt-16 pb-24">
        <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">
          Revisa las Estrategias de Control aplicables a la tarea
        </h1>

        {suggestedStrategies.length > 0 && (
          <div className="mb-4 flex flex-col items-center">
            <h2 className="text-base font-semibold mb-2">Estrategias Sugeridas:</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedStrategies.map(strategy => {
                const isRemoved = removedSuggestions.includes(strategy.id);
                return (
                  <div
                    key={strategy.id}
                    className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
                      isRemoved 
                        ? 'bg-white border-2 border-teal-700 text-teal-700' 
                        : 'bg-teal-700 text-white'
                    }`}
                  >
                    {strategy.name}
                    <button
                      onClick={() => isRemoved 
                        ? handleSuggestionAdd(strategy) 
                        : handleSuggestionRemove(strategy)
                      }
                      className={`hover:bg-teal-800 rounded-full p-0.5 ${
                        isRemoved ? 'hover:bg-teal-100' : ''
                      }`}
                    >
                      {isRemoved ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Busca estrategias de control"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border border-gray-200 rounded-lg">
          <div className="max-h-[calc(100vh-430px)] overflow-y-auto">
            {filteredStrategies.length > 0 ? (
              filteredStrategies.map(strategy => (
                <label
                  key={strategy.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedStrategies.some(s => s.id === strategy.id)}
                      onChange={() => handleStrategyToggle(strategy)}
                      className="h-5 w-5 rounded border-gray-300 text-black focus:ring-teal-700 checked:bg-black checked:hover:bg-black"
                    />
                  </div>
                  <span className="text-gray-700">{strategy.name}</span>
                </label>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No se encontraron estrategias que coincidan con tu búsqueda
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          onClick={handleConfirm}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white h-12 text-lg"
          disabled={selectedStrategies.length === 0}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
} 