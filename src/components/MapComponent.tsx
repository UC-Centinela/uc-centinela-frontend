"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface MapComponentProps {
  tasks: Array<{
    id: string;
    title: string;
    latitude?: number;
    longitude?: number;
    locationTitle?: string;
    locationDescription?: string;
    state: string;
  }>;
  onLocationSelect?: (lat: number, lng: number, title?: string, description?: string) => void;
  isInteractive?: boolean;
  selectedLocation?: {
    lat: number;
    lng: number;
    title?: string;
    description?: string;
  };
}

// Dynamic import for the actual map component
const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
    <span className="text-gray-500">Cargando mapa...</span>
  </div>
});

export default function MapComponent(props: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Cargando mapa...</span>
    </div>;
  }

  return <DynamicMap {...props} />;
}