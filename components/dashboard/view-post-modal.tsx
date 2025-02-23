'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Post } from "@/types/post";
import { Badge } from "@/components/ui/badge";

interface ViewPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewPostModal({ post, isOpen, onClose }: ViewPostModalProps) {
  const t = useTranslations('dashboard');

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video relative">
            {post.photos?.find(p => p.isCover)?.url && (
              <img
                src={post.photos.find(p => p.isCover)?.url}
                alt={post.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <Badge className="absolute top-2 right-2">
              {t(`posts.status.${post.status}`)}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('form.type.label')}</h3>
            <p>{t(`form.type.options.${post.type}`)}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('form.description.label')}</h3>
            <p className="whitespace-pre-wrap">{post.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {post.photos.filter(p => !p.isCover).map((photo) => (
              <img
                key={photo.url}
                src={photo.url}
                alt=""
                className="w-full aspect-square object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 