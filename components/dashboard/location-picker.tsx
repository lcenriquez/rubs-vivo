'use client';

import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMemo, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  value?: Location;
  onChange: (location: Location) => void;
}

const libraries: ("places")[] = ["places"];

const DEFAULT_CENTER = {
  lat: 18.9242,  // Cuernavaca coordinates
  lng: -99.2216
};

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const t = useTranslations('dashboard.form.location');
  const [address, setAddress] = useState(value?.address || '');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const center = useMemo(() => ({
    lat: value?.lat ?? DEFAULT_CENTER.lat,
    lng: value?.lng ?? DEFAULT_CENTER.lng
  }), [value?.lat, value?.lng]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const position = e.latLng;
    
    if (marker) {
      marker.setPosition(position);
    }
    
    updateLocation(position);
  }, [onChange, marker]);

  const updateLocation = useCallback((position: google.maps.LatLng) => {
    // Reverse geocode to get address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const newAddress = results[0].formatted_address;
        setAddress(newAddress);
        onChange({ lat: position.lat(), lng: position.lng(), address: newAddress });
      } else {
        onChange({ lat: position.lat(), lng: position.lng() });
      }
    });
  }, [onChange]);

  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    updateLocation(e.latLng);
  }, [updateLocation]);

  const handleAddressSearch = useCallback((event: any) => {
    event?.preventDefault();
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]?.geometry?.location) {
        const position = results[0].geometry.location;
        const newAddress = results[0].formatted_address;
        setAddress(newAddress);
        onChange({ lat: position.lat(), lng: position.lng(), address: newAddress });
        (map as any)?.panTo(position);
        
        if (marker) {
          marker.setPosition(position);
        }
      }
    });
  }, [address, onChange, map, marker]);

  const handleZoom = useCallback((delta: number) => {
    if (map) {
      const newZoom = ((map as any).getZoom() || 14) + delta;
      (map as any).setZoom(newZoom);
    }
  }, [map]);

  if (loadError) return <div>{t('couldNotLoadMap')}</div>;
  if (!isLoaded) return <div>{t('loading')}</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={t('searchPlaceholder')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch(e)}
        />
        <Button type="button" onClick={handleAddressSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative h-[400px] rounded-md overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={14}
          onClick={onMapClick}
          onLoad={(map: google.maps.Map) => setMap(map)}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: false,
            zoomControl: false,
          }}
        >
          <MarkerF
            position={center}
            onLoad={marker => setMarker(marker)}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            animation={window.google?.maps.Animation.DROP}
            title={t('markerHint')}
          />
        </GoogleMap>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleZoom(1)}
            type="button"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleZoom(-1)}
            type="button"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 