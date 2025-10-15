"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, X } from "lucide-react";
import MapComponent from "./MapComponent";

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }) => void;
  onLocationClear: () => void;
  selectedLocation?: {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  };
}

export default function LocationPicker({
  onLocationSelect,
  onLocationClear,
  selectedLocation
}: LocationPickerProps) {
  const [showMap, setShowMap] = useState(false);
  const [locationTitle, setLocationTitle] = useState(selectedLocation?.title || "");
  const [locationDescription, setLocationDescription] = useState(selectedLocation?.description || "");

  const handleMapClick = (lat: number, lng: number) => {
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      title: locationTitle || undefined,
      description: locationDescription || undefined
    });
    setShowMap(false);
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      onLocationSelect({
        ...selectedLocation,
        title: locationTitle || undefined,
        description: locationDescription || undefined
      });
      setShowMap(false);
    }
  };

  const handleClearLocation = () => {
    setLocationTitle("");
    setLocationDescription("");
    onLocationClear();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Ubicación de la tarea</Label>
        {selectedLocation ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearLocation}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Quitar ubicación
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMap(true)}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Seleccionar ubicación
          </Button>
        )}
      </div>

      {selectedLocation && (
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              Lat: {selectedLocation.latitude.toFixed(6)}, 
              Lng: {selectedLocation.longitude.toFixed(6)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div>
              <Label htmlFor="location-title" className="text-xs">Título del lugar (opcional)</Label>
              <Input
                id="location-title"
                value={locationTitle}
                onChange={(e) => setLocationTitle(e.target.value)}
                placeholder="Ej: Oficina principal, Almacén, etc."
                className="text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="location-description" className="text-xs">Descripción del lugar (opcional)</Label>
              <Textarea
                id="location-description"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="Ej: Edificio de 3 pisos, entrada por la puerta principal..."
                className="text-sm"
                rows={2}
              />
            </div>
            
            <Button
              type="button"
              size="sm"
              onClick={handleSaveLocation}
              className="w-full"
            >
              Guardar información del lugar
            </Button>
          </div>
        </div>
      )}

      {showMap && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selecciona una ubicación en el mapa</Label>
            <p className="text-xs text-gray-600">
              Haz clic en el mapa para seleccionar la ubicación de la tarea
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="map-location-title" className="text-xs">Título del lugar (opcional)</Label>
            <Input
              id="map-location-title"
              value={locationTitle}
              onChange={(e) => setLocationTitle(e.target.value)}
              placeholder="Ej: Oficina principal, Almacén, etc."
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="map-location-description" className="text-xs">Descripción del lugar (opcional)</Label>
            <Textarea
              id="map-location-description"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              placeholder="Ej: Edificio de 3 pisos, entrada por la puerta principal..."
              className="text-sm"
              rows={2}
            />
          </div>
          
          <MapComponent
            tasks={[]}
            onLocationSelect={handleMapClick}
            isInteractive={true}
            selectedLocation={selectedLocation ? {
              lat: selectedLocation.latitude,
              lng: selectedLocation.longitude,
              title: selectedLocation.title,
              description: selectedLocation.description
            } : undefined}
          />
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMap(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            {selectedLocation && (
              <Button
                type="button"
                onClick={handleSaveLocation}
                className="flex-1"
              >
                Confirmar ubicación
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
