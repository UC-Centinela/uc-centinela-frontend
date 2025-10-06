import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// ✅ Loading component optimizado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// ✅ Lazy loading de componentes pesados
export const LazyTaskExecution = dynamic(
  () => import('../app/tasks/components/TaskExecution'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Deshabilitar SSR para componentes pesados
  }
);

export const LazyPhotoUploadForm = dynamic(
  () => import('../app/tasks/components/PhotoUploadForm'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyVideoDetails = dynamic(
  () => import('../app/tasks/[task_id]/video-details/VideoDetailsClient'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyTranscriptionDisplay = dynamic(
  () => import('../app/transcription/components/TranscriptionDisplay'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// ✅ Lazy loading de páginas completas
export const LazyRiskAnalysisPage = dynamic(
  () => import('../app/tasks/[task_id]/risk_analysis/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyArtpResultPage = dynamic(
  () => import('../app/tasks/[task_id]/artp-result/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// ✅ Wrapper con Suspense para mejor UX
interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SuspenseWrapper = ({ children, fallback = <LoadingSpinner /> }: SuspenseWrapperProps) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);
