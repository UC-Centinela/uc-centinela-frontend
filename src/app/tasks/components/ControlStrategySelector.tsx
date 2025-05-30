"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gql, useMutation, useQuery } from '@apollo/client'
import client from '@/lib/apollo-client'

const FIND_ALL_CONTROL_STRATEGIES = gql`
  query FindAllControlStrategies {
    findAllControlStrategies {
      id
      taskId
      title
    }
  }
`;

const UPDATE_CONTROL_STRATEGY = gql`
  mutation UpdateControlStrategy($input: UpdateControlStrategyInput!) {
    updateControlStrategy(input: $input) {
      id
      taskId
      title
    }
  }
`;

const DELETE_CONTROL_STRATEGY = gql`
  mutation DeleteControlStrategy($deleteControlStrategyId: Int!) {
    deleteControlStrategy(id: $deleteControlStrategyId)
  }
`;

interface ControlStrategy {
  id: string;
  taskId?: number | null;
  title: string;
}

interface ControlStrategySelectorProps {
  onClose: () => void;
  onConfirm: (selectedStrategies: ControlStrategy[]) => void;
  taskId: number;
  existingStrategies?: ControlStrategy[];
}

export default function ControlStrategySelector({
  onClose,
  onConfirm,
  taskId,
  existingStrategies = []
}: ControlStrategySelectorProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<ControlStrategy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");

  // Query para obtener todas las estrategias
  const { data: strategiesData, loading: loadingStrategies } = useQuery(FIND_ALL_CONTROL_STRATEGIES, {
    client,
    skip: !taskId,
    onError: (error) => {
      console.error('Error fetching strategies:', error);
      setError('Error al cargar las estrategias. Por favor, intenta de nuevo.');
    }
  });

  // Mutation para actualizar estrategias
  const [updateStrategy] = useMutation(UPDATE_CONTROL_STRATEGY, {
    client,
    onError: (error) => {
      console.error('Error updating strategy:', error);
      setError('Error al agregar la estrategia. Por favor, intenta de nuevo.');
    }
  });

  // Mutation para eliminar estrategias
  const [deleteStrategy] = useMutation(DELETE_CONTROL_STRATEGY, {
    client,
    onError: (error) => {
      console.error('Error deleting strategy:', error);
      setError('Error al eliminar la estrategia. Por favor, intenta de nuevo.');
    }
  });

  // Inicializar estrategias seleccionadas con las existentes
  useEffect(() => {
    if (existingStrategies?.length > 0) {
      setSelectedStrategies(existingStrategies);
    }
  }, [existingStrategies]);

  // Obtener estrategias únicas (sin duplicados por título)
  const uniqueStrategies = useMemo(() => {
    if (!strategiesData?.findAllControlStrategies) return [];
    
    return strategiesData.findAllControlStrategies.reduce((acc: ControlStrategy[], current: ControlStrategy) => {
      const exists = acc.some((strategy: ControlStrategy) => strategy.title === current.title);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
  }, [strategiesData]);

  const handleStrategyToggle = async (strategy: ControlStrategy) => {
    setError(""); // Clear previous errors
    const isSelected = selectedStrategies.some(s => s.title === strategy.title);
    
    if (isSelected) {
      // Si ya está seleccionada, la quitamos
      const strategyToRemove = selectedStrategies.find(s => s.title === strategy.title);
      if (strategyToRemove?.taskId === taskId) {
        try {
          await deleteStrategy({
            variables: {
              deleteControlStrategyId: Number(strategyToRemove.id)
            }
          });
          setSelectedStrategies(prev => prev.filter(s => s.title !== strategy.title));
        } catch (error) {
          console.error('Error in delete operation:', error);
          setError('Error al eliminar la estrategia. Por favor, intenta de nuevo.');
        }
      }
    } else {
      // Si no está seleccionada, creamos una nueva con el taskId actual
      try {
        const result = await updateStrategy({
          variables: {
            input: {
              taskId,
              title: strategy.title
            }
          }
        });
        
        if (result.data?.updateControlStrategy) {
          setSelectedStrategies(prev => [...prev, result.data.updateControlStrategy]);
        }
      } catch (error) {
        console.error('Error in update operation:', error);
        setError('Error al agregar la estrategia. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedStrategies);
    onClose();
  };

  const filteredStrategies = useMemo(() => {
    return uniqueStrategies.filter((strategy: ControlStrategy) => 
      strategy.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uniqueStrategies, searchQuery]);

  if (loadingStrategies) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

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

        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
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
              filteredStrategies.map((strategy: ControlStrategy) => (
                <label
                  key={strategy.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedStrategies.some(s => s.title === strategy.title)}
                      onChange={() => handleStrategyToggle(strategy)}
                      className="h-5 w-5 rounded border-gray-300 text-black focus:ring-teal-700 checked:bg-black checked:hover:bg-black"
                    />
                  </div>
                  <span className="text-gray-700">{strategy.title}</span>
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