'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const libraries: ("places")[] = ["places"];

interface SearchLocationProps {
  initialValue?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  placeholder?: string;
}

export function SearchLocation({ initialValue = '', onLocationSelect, placeholder }: SearchLocationProps) {
  const t = useTranslations('home.hero');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['(cities)'] }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setValue(place.formatted_address || '');
          onLocationSelect?.(lat, lng);
        }
      });
    }
  }, [isLoaded, onLocationSelect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setIsLoading(true);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: value },
      (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          onLocationSelect?.(lat, lng);
        }
        setIsLoading(false);
      }
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex w-full gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            disabled
            placeholder={t('loading')}
            className="w-full pl-4 h-12 text-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          />
        </div>
        <Button disabled type="button" size="lg" className="h-12 px-6 bg-green-600">
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <Input 
          ref={inputRef}
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || t('searchPlaceholder')}
          className="w-full pl-4 h-12 text-lg"
        />
      </div>
      <Button 
        type="submit" 
        size="lg" 
        disabled={isLoading}
        className="h-12 px-6"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
} 