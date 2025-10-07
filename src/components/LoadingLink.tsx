'use client'

import { useState } from 'react';
import Link from 'next/link';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingLink({ 
  href, 
  children, 
  className = '', 
  onClick 
}: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    // Mostrar loading inmediatamente
    setIsLoading(true);
    
    // Ejecutar onClick personalizado si existe
    if (onClick) {
      onClick();
    }
    
    // El Link de Next.js manejará la navegación
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
