import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/post';
import { useTranslations } from 'next-intl';
import { MapPin, ChevronLeft, ChevronRight, Phone, Mail, Globe } from 'lucide-react';

interface PostDetailsModalProps {
  post: Post;
  open: boolean;
  onClose: () => void;
}

export function PostDetailsModal({ post, open, onClose }: PostDetailsModalProps) {
  const t = useTranslations();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<{[key: number]: boolean}>({});
  
  // Reset loading state when the current image changes
  useEffect(() => {
    if (!loadedImages[currentImageIndex]) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [currentImageIndex, loadedImages]);

  // Preload images for smoother transitions
  useEffect(() => {
    if (open && post.photos) {
      // Preload current and adjacent images
      const imagesToPreload = [
        currentImageIndex,
        (currentImageIndex + 1) % post.photos.length,
        (currentImageIndex - 1 + post.photos.length) % post.photos.length
      ];
      
      imagesToPreload.forEach(index => {
        const img = new window.Image();
        img.src = post.photos[index].url;
        img.onload = () => {
          setLoadedImages(prev => ({...prev, [index]: true}));
          if (index === currentImageIndex) {
            setIsLoading(false);
          }
        };
      });
    }
  }, [open, post.photos, currentImageIndex]);
  
  // Reset states when modal opens
  useEffect(() => {
    if (open) {
      setCurrentImageIndex(0);
      setIsLoading(true);
    }
  }, [open]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : post.photos.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev < post.photos.length - 1 ? prev + 1 : 0));
  };

  // Add keyboard event listener for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreen) return;
      
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setIsFullScreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, post.photos.length]);

  // Check if contact info should be displayed
  const showContactInfo = post.showContactInfo && post.contactInfo && (
    post.contactInfo.name || 
    post.contactInfo.phone || 
    post.contactInfo.email || 
    post.contactInfo.website
  );

  return (
    <>
      {/* Post details modal */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogTitle className="sr-only">{post.title}</DialogTitle>
          <div className="relative">
            <div className="aspect-video relative w-full overflow-hidden bg-muted">
              <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <img
                  src={post.photos[currentImageIndex].url}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreen(true);
                  }}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {post.photos.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage(e);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage(e);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {post.photos.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {post.photos.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-6 overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{post.title}</h2>
                <div className="flex items-center gap-2 mt-2 mb-1">
                  <Badge>{t(`dashboard.form.type.options.${post.type}`)}</Badge>
                  <Badge>{t(`dashboard.form.urineSystem.options.${post.urineSystem}`)}</Badge>
                </div>
                <div className="flex items-center mt-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {post.isLocationPrivate ? t('dashboard.form.locationPrivacy.approximate') : post.location.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {post.description && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">{t('dashboard.form.description.label')}</h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{post.description}</p>
              </div>
            )}

            {/* Dry Mixture Information */}
            {post.dryMixture && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">{t('dashboard.form.dryMixture.label')}</h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{post.dryMixture}</p>
              </div>
            )}

            {/* Collection Service Information */}
            {post.collectionService && (post.collectionService.name || post.collectionService.website) && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">{t('dashboard.form.collectionService.label')}</h3>
                {post.collectionService.name && (
                  <p className="text-muted-foreground mt-2">{post.collectionService.name}</p>
                )}
                {post.collectionService.website && (
                  <a 
                    href={post.collectionService.website.startsWith('http') ? post.collectionService.website : `https://${post.collectionService.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center mt-1"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    {post.collectionService.website}
                  </a>
                )}
              </div>
            )}

            {/* Contact Information */}
            {showContactInfo && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">{t('dashboard.form.contactInfo.label')}</h3>
                <div className="mt-2 space-y-2">
                  {post.contactInfo?.name && (
                    <p className="text-muted-foreground">{post.contactInfo.name}</p>
                  )}
                  {post.contactInfo?.phone && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-1" />
                      <a href={`tel:${post.contactInfo.phone}`} className="hover:text-primary">
                        {post.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {post.contactInfo?.email && !post.isLocationPrivate && (
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-1" />
                      <a href={`mailto:${post.contactInfo.email}`} className="hover:text-primary">
                        {post.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {post.contactInfo?.website && !post.isLocationPrivate && (
                    <div className="flex items-center text-muted-foreground">
                      <Globe className="h-4 w-4 mr-1" />
                      <a 
                        href={post.contactInfo.website.startsWith('http') ? post.contactInfo.website : `https://${post.contactInfo.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {post.contactInfo.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full screen image modal using Shadcn Dialog */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent 
          className="max-w-none max-h-none h-screen w-screen p-0 bg-black border-none"
          closeButtonVariant="light"
        >
          <DialogTitle className="sr-only">{`${post.title} - Image ${currentImageIndex + 1} of ${post.photos.length}`}</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} flex items-center justify-center h-full w-full`}>
              <img
                src={post.photos[currentImageIndex].url}
                alt=""
                className="max-w-[95vw] max-h-[85vh] object-contain"
                onLoad={() => setIsLoading(false)}
              />
            </div>
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* <Button
              variant="ghost"
              className="absolute top-4 left-4 text-white hover:bg-white/10 flex items-center gap-2"
              onClick={() => setIsFullScreen(false)}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t('common.return') || 'Return'}</span>
            </Button> */}

            {post.photos.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 md:left-8"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 md:right-8"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
          
          {post.photos.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
              {post.photos.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}