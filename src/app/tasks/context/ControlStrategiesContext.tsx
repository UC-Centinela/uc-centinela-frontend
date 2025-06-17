"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface ControlStrategy {
  id: string;
  taskId?: number | null;
  title: string;
}

interface ControlStrategiesContextType {
  selectedStrategies: ControlStrategy[];
  setSelectedStrategies: (strategies: ControlStrategy[]) => void;
}

const ControlStrategiesContext = createContext<ControlStrategiesContextType | undefined>(undefined);

export function ControlStrategiesProvider({ children, initialStrategies = [] }: { children: ReactNode, initialStrategies?: ControlStrategy[] }) {
  const [selectedStrategies, setSelectedStrategies] = useState<ControlStrategy[]>(initialStrategies);

  return (
    <ControlStrategiesContext.Provider value={{ selectedStrategies, setSelectedStrategies }}>
      {children}
    </ControlStrategiesContext.Provider>
  );
}

export function useControlStrategies() {
  const context = useContext(ControlStrategiesContext);
  if (context === undefined) {
    throw new Error('useControlStrategies must be used within a ControlStrategiesProvider');
  }
  return context;
}
