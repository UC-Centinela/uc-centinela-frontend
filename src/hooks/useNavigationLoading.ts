'use client'

import { useState, useEffect } from 'react';

// Estado global simple
let globalLoadingState = false;
let globalTimeout: NodeJS.Timeout | null = null;
const globalListeners: Set<() => void> = new Set();

// Función para notificar a todos los listeners
const notifyListeners = () => {
  globalListeners.forEach(listener => listener());
};

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(globalLoadingState);

  // Sincronizar con el estado global
  useEffect(() => {
    const updateState = () => {
      setIsLoading(globalLoadingState);
    };
    
    globalListeners.add(updateState);
    updateState(); // Sincronizar inmediatamente
    
    return () => {
      globalListeners.delete(updateState);
    };
  }, []);

  const startLoading = () => {
    globalLoadingState = true;
    setIsLoading(true);
    notifyListeners();
    
    // Limpiar timeout anterior
    if (globalTimeout) {
      clearTimeout(globalTimeout);
    }
    
    // Timeout de seguridad: máximo 10 segundos
    globalTimeout = setTimeout(() => {
      globalLoadingState = false;
      setIsLoading(false);
      notifyListeners();
    }, 10000);
  };
  
  const stopLoading = () => {
    globalLoadingState = false;
    setIsLoading(false);
    notifyListeners();
    
    if (globalTimeout) {
      clearTimeout(globalTimeout);
      globalTimeout = null;
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading
  };
}
