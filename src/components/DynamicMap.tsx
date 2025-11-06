"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouterLoading } from "@/hooks/useRouterLoading";

// Fix for default markers in react-leaflet
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

// Fix for default markers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface DynamicMapProps {
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

// Component to handle map clicks
function MapClickHandler({ onLocationSelect, isInteractive }: { onLocationSelect?: (lat: number, lng: number, title?: string, description?: string) => void; isInteractive?: boolean }) {
  useMapEvents({
    click: (e) => {
      if (isInteractive && onLocationSelect) {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      }
    },
  });
  return null;
}

export default function DynamicMap({ 
  tasks, 
  onLocationSelect, 
  isInteractive = false,
  selectedLocation 
}: DynamicMapProps) {
  const { push: pushWithLoading } = useRouterLoading();
  
  // Default center (Santiago, Chile)
  const defaultCenter: [number, number] = [-33.4489, -70.6693];
  
  // Calculate center based on tasks or selected location
  let center: [number, number] = defaultCenter;
  if (selectedLocation) {
    center = [selectedLocation.lat, selectedLocation.lng];
  } else if (tasks.length > 0) {
    const tasksWithLocation = tasks.filter(task => task.latitude && task.longitude);
    if (tasksWithLocation.length > 0) {
      const avgLat = tasksWithLocation.reduce((sum, task) => sum + (task.latitude || 0), 0) / tasksWithLocation.length;
      const avgLng = tasksWithLocation.reduce((sum, task) => sum + (task.longitude || 0), 0) / tasksWithLocation.length;
      center = [avgLat, avgLng];
    }
  }

  const getMarkerColor = (state: string) => {
    switch (state) {
      case "PENDING":
      case "IN_PROGRESS":
        return "#f59e0b"; // amber
      case "COMPLETED":
        return "#3b82f6"; // blue
      case "REVIEWED":
        return "#10b981"; // green
      case "IS_REJECTED":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render task markers */}
        {tasks
          .filter(task => task.latitude && task.longitude)
          .map((task) => (
            <Marker
              key={task.id}
              position={[task.latitude!, task.longitude!]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      onClick={() => {
                        console.log('🗺️ [DynamicMap] Navegando a detalle de tarea:', task.id);
                        pushWithLoading(`/tasks/${task.id}`);
                      }}
                    >
                      {task.title}
                    </button>
                  </h3>
                  {task.locationTitle && (
                    <p className="text-xs text-gray-600 mt-1">{task.locationTitle}</p>
                  )}
                  {task.locationDescription && (
                    <p className="text-xs text-gray-500 mt-1">{task.locationDescription}</p>
                  )}
                  <div className="flex items-center mt-2">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getMarkerColor(task.state) }}
                    />
                    <span className="text-xs capitalize">{task.state.toLowerCase().replace('_', ' ')}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        
        {/* Render selected location marker */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">Ubicación seleccionada</h3>
                {selectedLocation.title && (
                  <p className="text-xs text-gray-600 mt-1">{selectedLocation.title}</p>
                )}
                {selectedLocation.description && (
                  <p className="text-xs text-gray-500 mt-1">{selectedLocation.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Handle map clicks for location selection */}
        {isInteractive && (
          <MapClickHandler onLocationSelect={onLocationSelect} isInteractive={isInteractive} />
        )}
      </MapContainer>
    </div>
  );
}
