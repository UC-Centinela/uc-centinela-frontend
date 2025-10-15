'use client';

import { Button } from '@/components/ui/button';
import { useRouterLoading } from '@/hooks/useRouterLoading';

export default function NotFound() {
  const { push: pushWithLoading } = useRouterLoading();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button
          onClick={() => pushWithLoading('/')}
          className="mt-4"
          variant="default"
          size="lg"
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
} 