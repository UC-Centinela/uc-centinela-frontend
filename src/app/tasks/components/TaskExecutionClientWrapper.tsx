"use client";

import { createContext, useState, useContext, ReactNode } from 'react';
import TaskExecution from "./TaskExecution";

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

export function useControlStrategies() {
  const context = useContext(ControlStrategiesContext);
  if (context === undefined) {
    throw new Error('useControlStrategies must be used within a ControlStrategiesProvider');
  }
  return context;
}

function ControlStrategiesProvider({ children, initialStrategies = [] }: { children: ReactNode, initialStrategies?: ControlStrategy[] }) {
  const [selectedStrategies, setSelectedStrategies] = useState<ControlStrategy[]>(initialStrategies);

  return (
    <ControlStrategiesContext.Provider value={{ selectedStrategies, setSelectedStrategies }}>
      {children}
    </ControlStrategiesContext.Provider>
  );
}

interface MultimediaData {
  id: number;
  taskId: number;
  photoUrl: string | null;
  videoUrl: string | null;
  audioTranscription: string | null;
}

interface TaskExecutionClientWrapperProps {
  taskId: string;
  multimediaData: MultimediaData[];
  taskComments: string | null;
}

export default function TaskExecutionClientWrapper({
  taskId,
  multimediaData,
  taskComments
}: TaskExecutionClientWrapperProps) {
  return (
    <ControlStrategiesProvider>
      <TaskExecution
        taskId={taskId}
        multimediaData={multimediaData}
        taskComments={taskComments}
      />
    </ControlStrategiesProvider>
  );
}
