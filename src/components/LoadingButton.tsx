'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoadingButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingButton({ 
  href, 
  children, 
  className = '', 
  onClick 
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Mostrar loading inmediatamente
    setIsLoading(true);
    
    // Ejecutar onClick personalizado si existe
    if (onClick) {
      onClick();
    }
    
    // Navegar después de un pequeño delay para mostrar la animación
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
          <span>Cargando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
