'use client';

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PostPhoto } from "@/types/post";
import { uploadPhoto, deletePhoto } from "@/lib/storage";
import { Image as ImageIcon, X, Star, StarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface PhotoUploadProps {
  value: PostPhoto[];
  onChange: (photos: PostPhoto[]) => void;
  userId?: string;
  postId?: string;
}

export function PhotoUpload({ value, onChange, userId, postId }: PhotoUploadProps) {
  const t = useTranslations('dashboard.form.photos');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState(0);

  // Compress image to target size (1MB)
  const compressImage = async (file: File): Promise<File> => {
    // Skip compression if the file is already smaller than 1MB
    if (file.size <= 1000 * 1024) {
      console.log(`Skipping compression for ${file.name} (${(file.size / 1024).toFixed(2)}KB) - already optimized`);
      return file;
    }
    
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (progress: number) => {
        setCompressionProgress(progress);
      }
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error compressing image:', error);
      // If compression fails, return the original file
      return file;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!userId || !postId || acceptedFiles.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setCompressionProgress(0);

      // Create a unique timestamp for each batch upload to avoid filename collisions
      const batchTimestamp = Date.now();
      const totalFiles = acceptedFiles.length;
      let completedFiles = 0;

      // Process files sequentially to avoid race conditions
      const newPhotos: PostPhoto[] = [];
      
      for (let index = 0; index < acceptedFiles.length; index++) {
        const file = acceptedFiles[index];
        try {
          // Compress the image before uploading
          const originalSize = (file.size / 1024 / 1024).toFixed(2);
          const compressedFile = await compressImage(file);
          const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
          
          // Log compression results
          if (file === compressedFile) {
            console.log(`Image ${index + 1}/${totalFiles}: ${originalSize}MB - Skipped compression (already optimized)`);
          } else {
            console.log(`Image ${index + 1}/${totalFiles}: Compressed ${originalSize}MB → ${compressedSize}MB`);
          }
          
          // Add a unique identifier to each file to prevent collisions
          const url = await uploadPhoto(
            compressedFile, 
            userId, 
            postId, 
            (progress) => {
              // Only update progress when a file is complete
              if (progress === 100) {
                completedFiles++;
                setUploadProgress((completedFiles / totalFiles) * 100);
              }
            },
            `${batchTimestamp}-${index}`
          );
          
          newPhotos.push({
            url,
            isCover: value.length === 0 && index === 0 // Only the first photo is cover by default, and only if there are no existing photos
          });
        } catch (error) {
          console.error(`Error uploading file ${index}:`, error);
          toast.error(t('error.uploadFailed'));
        }
      }

      if (newPhotos.length > 0) {
        // If there's no existing cover photo and we're adding new photos,
        // make the first new photo the cover
        if (value.length === 0) {
          newPhotos[0].isCover = true;
          onChange(newPhotos);
        } else {
          // If there's already a cover photo, add new photos after it
          const existingPhotos = [...value];
          const coverIndex = existingPhotos.findIndex(photo => photo.isCover);
          
          // If somehow there's no cover photo, make the first existing photo the cover
          if (coverIndex === -1 && existingPhotos.length > 0) {
            existingPhotos[0].isCover = true;
          }
          
          onChange(existingPhotos.concat(newPhotos));
        }
      }
    } catch (error) {
      console.error('Error in batch upload:', error);
      toast.error(t('error.uploadFailed'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCompressionProgress(0);
    }
  }, [value, userId, postId, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10 - value.length,
    disabled: isUploading || value.length >= 10
  });

  const removePhoto = async (index: number, event: any) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent event bubbling
    
    if (index < 0 || index >= value.length) {
      toast.error(t('error.invalidPhoto'));
      return;
    }
    
    // Store the photo to remove
    const photoToRemove = value[index];
    const wasCover = photoToRemove.isCover;
    
    // Create a new array without the removed photo
    const newPhotos = value.filter((_, i) => i !== index);
    
    // If we removed the cover photo and there are still photos, make the first one the cover
    if (wasCover && newPhotos.length > 0) {
      newPhotos[0] = { ...newPhotos[0], isCover: true };
    }
    
    // Update the UI immediately
    onChange(newPhotos);
    
    try {
      // Then try to delete from storage
      await deletePhoto(photoToRemove.url);
    } catch (error) {
      console.error('Error deleting photo from storage:', error);
      toast.error(t('error.deletePhoto'));
    }
  };

  const toggleCover = (index: number, event: any) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent event bubbling
    
    if (index < 0 || index >= value.length) {
      return;
    }
    
    // Find the current cover photo
    const currentCoverIndex = value.findIndex(photo => photo.isCover);
    
    // Create a new array with the updated cover photo
    const newPhotos = [...value];
    
    // Remove cover status from current cover
    if (currentCoverIndex !== -1) {
      newPhotos[currentCoverIndex] = { ...newPhotos[currentCoverIndex], isCover: false };
    }
    
    // Set the new cover
    newPhotos[index] = { ...newPhotos[index], isCover: true };
    
    // Move the new cover photo to the first position
    if (index !== 0) {
      const coverPhoto = newPhotos[index];
      newPhotos.splice(index, 1); // Remove from current position
      newPhotos.unshift(coverPhoto); // Add to beginning
    }
    
    onChange(newPhotos);
  };

  const movePhoto = (index: number, direction: 'left' | 'right', event: any) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent event bubbling
    
    // Find the cover photo index (should be 0)
    const coverIndex = value.findIndex(photo => photo.isCover);
    
    // Don't allow moving the cover photo
    if (index === coverIndex) {
      return;
    }
    
    // Don't allow moving to the cover photo's position
    if (direction === 'left' && index === coverIndex + 1) {
      return;
    }
    
    if (
      index < 0 || 
      index >= value.length || 
      (direction === 'left' && index === 0) || 
      (direction === 'right' && index === value.length - 1)
    ) {
      return;
    }
    
    // Create a new array with the photos in the new order
    const newPhotos = [...value];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    
    // Swap the photos
    [newPhotos[index], newPhotos[newIndex]] = [newPhotos[newIndex], newPhotos[index]];
    
    onChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`p-8 border-dashed text-center cursor-pointer ${isDragActive ? 'border-primary' : ''
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('dropzone')}
          </p>
        </div>
      </Card>

      {isUploading && (
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{uploadProgress > 0 ? `${t('uploading')} (${Math.round(uploadProgress)}%)` : t('uploading')}</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((photo, index) => (
            <Card 
              key={`${photo.url}-${index}`} 
              className="relative group overflow-hidden"
            >
              <img
                src={photo.url}
                alt=""
                className="w-full aspect-square object-cover rounded-lg"
                onError={(e) => {
                  // Handle image loading errors
                  console.error(`Failed to load image: ${photo.url}`);
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                }}
              />
              {!photo.isCover && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => toggleCover(index, e)}
                    className="text-white hover:text-yellow-400"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => removePhoto(index, e)}
                    className="text-white hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {photo.isCover && (
                <>
                  <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full">
                    {t('coverPhoto')}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => removePhoto(index, e)}
                      className="text-white hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
              
              {/* Order controls - shown on hover for non-cover photos */}
              {!photo.isCover && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => movePhoto(index, 'left', e)}
                    disabled={index === 0}
                    className="h-6 w-6 bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
                    title={t('moveLeft')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => movePhoto(index, 'right', e)}
                    disabled={index === value.length - 1}
                    className="h-6 w-6 bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
                    title={t('moveRight')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 