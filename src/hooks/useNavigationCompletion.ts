'use client'

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationLoading } from './useNavigationLoading';

export function useNavigationCompletion() {
  const pathname = usePathname();
  const { stopLoading } = useNavigationLoading();
  const previousPathname = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solo procesar si realmente cambió la ruta
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Ocultar loading después de un delay para que se vea
      timeoutRef.current = setTimeout(() => {
        stopLoading();
      }, 200); // Delay mínimo para que se vea el loading
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, stopLoading]);
}
