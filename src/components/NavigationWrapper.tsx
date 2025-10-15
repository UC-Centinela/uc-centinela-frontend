'use client'

import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { useNavigationCompletion } from '@/hooks/useNavigationCompletion';
import GlobalLoading from './GlobalLoading';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const { isLoading } = useNavigationLoading();
  
  // Hook que detecta cuando la navegación termina
  useNavigationCompletion();


  return (
    <>
      {children}
      <GlobalLoading isVisible={isLoading} />
    </>
  );
}
