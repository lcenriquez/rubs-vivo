'use client';

import { useEffect, useState, useMemo } from 'react';
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

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const nearbyPosts = await getNearbyPosts(center, radius, firestore);
        setPosts(nearbyPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      loadPosts();
    }
  }, [center, radius, isLoaded, firestore]);

  const handleLocationChange = (lat: number, lng: number) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    newParams.set('lat', lat.toString());
    newParams.set('lng', lng.toString());
    router.push(`/map?${newParams.toString()}`);
  };

  const handleZoom = (delta: number) => {
    if (map) {
      const newZoom = (map as any).getZoom() + delta;
      (map as any).setZoom(newZoom);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              initialValue={searchParams?.get('address') || ''}
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
              position={{ lat: post.location.lat, lng: post.location.lng }}
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

                <div className="flex items-start text-sm text-muted-foreground mt-4">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{post.location.address}</span>
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