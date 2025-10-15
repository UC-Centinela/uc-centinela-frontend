'use client'

import { useEffect, useState } from 'react';

interface GlobalLoadingProps {
  isVisible: boolean;
}

export default function GlobalLoading({ isVisible }: GlobalLoadingProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Delay más corto para animación de salida
      const timer = setTimeout(() => setShouldRender(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-700"></div>
        <p className="text-teal-700 font-medium text-sm">Cargando...</p>
      </div>
    </div>
  );
}
