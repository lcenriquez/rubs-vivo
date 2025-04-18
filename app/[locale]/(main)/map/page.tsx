'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFirestore } from 'reactfire';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/post';
import { getNearbyPosts } from '@/lib/posts';
import { Loader2, MapPin, Plus, Minus, Text } from 'lucide-react';
import { SearchLocation } from '@/components/search-location';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostDetailsModal } from '@/components/post-details-modal';

const DEFAULT_CENTER = {
  lat: 18.9242,  // Cuernavaca coordinates
  lng: -99.2216
};

const DEFAULT_RADIUS = 50; // 50km radius

// Function to add random offset to coordinates
function fuzzLocation(lat: number, lng: number): { lat: number; lng: number } {
  const offset = 0.001; // Approx 111 meters
  const randomLatOffset = (Math.random() - 0.5) * 2 * offset;
  const randomLngOffset = (Math.random() - 0.5) * 2 * offset;
  return {
    lat: lat + randomLatOffset,
    lng: lng + randomLngOffset,
  };
}

export default function MapPage() {
  const t = useTranslations();
  const router = useRouter();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied' | 'error' | null>(null);
  const [address, setAddress] = useState('');

  const center = useMemo(() => {
    if (!searchParams) return DEFAULT_CENTER;
    const lat = parseFloat(searchParams.get('lat') ?? String(DEFAULT_CENTER.lat));
    const lng = parseFloat(searchParams.get('lng') ?? String(DEFAULT_CENTER.lng));
    return { lat, lng };
  }, [searchParams]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"]
  });

  const handleZoom = (delta: number) => {
    if (map) {
      const zoom = (map as any).getZoom() ?? 0;
      (map as any).setZoom(zoom + delta);
    }
  };

  const getUserLocation = useCallback(() => {
    setLocationStatus('requesting');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        // Update URL with coordinates
        const newParams = new URLSearchParams(searchParams?.toString() || '');
        newParams.set('lat', userLocation.lat.toString());
        newParams.set('lng', userLocation.lng.toString());
        router.push(`/map?${newParams.toString()}`);

        // Only try to reverse geocode if Google Maps is loaded
        if (isLoaded && window.google) {
          const geocoder = new window.google.maps.Geocoder();
          try {
            const result = await geocoder.geocode({ location: userLocation });
            if (result.results[0]) {
              const address = result.results[0].formatted_address;
              setAddress(address);
              newParams.set('address', address);
              router.push(`/map?${newParams.toString()}`);
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
          }
        }

        setLocationStatus('granted');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error');
      }
    );
  }, [router, searchParams, isLoaded]);

  useEffect(() => {
    if (isLoaded && !searchParams?.has('lat') && !searchParams?.has('lng')) {
      getUserLocation();
    }
  }, [getUserLocation, isLoaded, searchParams]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const nearbyPosts = await getNearbyPosts(center, radius, firestore);
        setPosts(nearbyPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Load posts if we have coordinates (either from geolocation or manual input)
    if (searchParams?.has('lat') && searchParams?.has('lng')) {
      loadPosts();
    } else {
      setIsLoading(false);
      setPosts([]);
    }
  }, [center, radius, firestore, searchParams]);

  const handleLocationChange = (lat: number, lng: number, selectedAddress?: string) => {
    const newParams = new URLSearchParams();
    newParams.set('lat', lat.toString());
    newParams.set('lng', lng.toString());
    if (selectedAddress) {
      newParams.set('address', selectedAddress);
      setAddress(selectedAddress);
    }
    router.push(`/map?${newParams.toString()}`);
    setLocationStatus('granted');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasLocation = searchParams?.has('lat') && searchParams?.has('lng');

  return (
    <div className="min-h-screen">
      {/* Filters Section */}
      <div className="container py-4">
        <h2 className="text-lg font-semibold mb-4">{t('map.filters.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('map.filters.location.label')}
            </label>
            <SearchLocation 
              initialValue={address || searchParams?.get('address') || ''}
              onLocationSelect={handleLocationChange}
              placeholder={t('map.filters.location.placeholder')}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('map.filters.radius.label')}
            </label>
            <Select
              value={radius.toString()}
              onValueChange={(value) => setRadius(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">{t('map.filters.radius.20km')}</SelectItem>
                <SelectItem value="50">{t('map.filters.radius.50km')}</SelectItem>
                <SelectItem value="100">{t('map.filters.radius.100km')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {hasLocation ? (
        <>
          {/* Map Section */}
          <div className="h-[60vh] relative">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={11}
              onLoad={setMap}
              options={{
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: false,
                zoomControl: false,
              }}
            >
              {/* Center marker */}
              <MarkerF
                position={center}
                icon={{
                  url: '/img/center-marker.svg',
                  scaledSize: new window.google.maps.Size(30, 30)
                }}
              />

              {/* Post markers */}
              {posts.map((post) => (
                <MarkerF
                  key={post.id}
                  position={post.isLocationPrivate
                    ? fuzzLocation(post.location.lat, post.location.lng)
                    : post.location}
                  onClick={() => setSelectedPost(post)}
                  animation={window.google.maps.Animation.DROP}
                />
              ))}
            </GoogleMap>

            {/* Zoom Controls */}
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

          {/* Posts List Section */}
          <div className="container py-8">
            <h2 className="text-2xl font-bold mb-6">
              {t('map.nearbyPosts')} ({posts.length})
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                {t('map.noPosts')}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className={`p-6 cursor-pointer transition-shadow hover:shadow-lg ${
                      selectedPost?.id === post.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.photos && post.photos.length > 0 && (
                      <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                        <img
                          src={post.photos[0].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{t(`dashboard.form.type.options.${post.type}`)}</Badge>
                        <Badge>{t(`dashboard.form.urineSystem.options.${post.urineSystem}`)}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{post.isLocationPrivate ? t('dashboard.form.locationPrivacy.approximate') : post.location.address}</span>
                    </div>

                    {post.description && (
                      <div className="flex items-start text-sm text-muted-foreground mt-4">
                        <Text className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{post.description}</span>
                      </div>
                    )}

                    <Button 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      {t('map.viewDetails')}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="container py-12">
          <Card className="p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              {locationStatus === 'denied' ? t('map.locationPermission.denied') : ''}
            </h3>
            <p className="text-muted-foreground">
              {t('map.locationPermission.enterAddress')}
            </p>
          </Card>
        </div>
      )}

      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          open={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
} 