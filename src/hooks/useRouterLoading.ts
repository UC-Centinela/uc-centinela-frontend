'use client'

import { useRouter } from 'next/navigation';
import { useNavigationLoading } from './useNavigationLoading';

export function useRouterLoading() {
  const router = useRouter();
  const { startLoading } = useNavigationLoading();

  const pushWithLoading = (href: string) => {
    // Iniciar loading inmediatamente
    startLoading();
    
    // Pequeño delay para asegurar que el loading se muestre
    setTimeout(() => {
      router.push(href);
    }, 50);
  };

  const replaceWithLoading = (href: string) => {
    startLoading();
    setTimeout(() => {
      router.replace(href);
    }, 50);
  };

  const backWithLoading = () => {
    startLoading();
    setTimeout(() => {
      router.back();
    }, 50);
  };

  const forwardWithLoading = () => {
    startLoading();
    setTimeout(() => {
      router.forward();
    }, 50);
  };

  return {
    push: pushWithLoading,
    replace: replaceWithLoading,
    back: backWithLoading,
    forward: forwardWithLoading,
    // Mantener métodos originales sin loading
    originalRouter: router
  };
}
