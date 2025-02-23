'use client';

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PostPhoto } from "@/types/post";
import { uploadPhoto, deletePhoto } from "@/lib/storage";
import { Image as ImageIcon, X, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!userId || !postId) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const totalFiles = acceptedFiles.length;
      let completedFiles = 0;

      const uploadPromises = acceptedFiles.map(async (file) => {
        const url = await uploadPhoto(file, userId, postId, (progress) => {
          completedFiles = progress === 100 ? completedFiles + 1 : completedFiles;
          setUploadProgress((completedFiles / totalFiles) * 100);
        });

        return {
          url,
          isCover: value.length === 0 // First photo is cover by default
        };
      });

      const newPhotos = await Promise.all(uploadPromises);
      onChange([...value, ...newPhotos]);
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [value, userId, postId]);

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
    
    try {
      // Delete the photo from storage first
      await deletePhoto(value[index].url);
      
      const newPhotos = [...value];
      newPhotos.splice(index, 1);

      // If we removed the cover photo, make the first remaining photo the cover
      if (value[index].isCover && newPhotos.length > 0) {
        newPhotos[0].isCover = true;
      }

      onChange(newPhotos);
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error(t('error.deletePhoto'));
    }
  };

  const toggleCover = (index: number, event: any) => {
    event.preventDefault();
    const newPhotos = value.map((photo, i) => ({
      ...photo,
      isCover: i === index
    }));
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
        <Progress value={uploadProgress} className="h-2" />
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((photo, index) => (
            <Card key={photo.url} className="relative group">
              <img
                src={photo.url}
                alt=""
                className="w-full aspect-square object-cover rounded-lg"
              />
                {!photo.isCover && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => toggleCover(index, e)}
                    >
                      <Star className="h-4 w-4 text-yellow-400" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => removePhoto(index, e)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              {photo.isCover && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full">
                  {t('coverPhoto')}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 