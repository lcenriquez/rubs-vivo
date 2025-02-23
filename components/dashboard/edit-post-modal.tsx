'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { EditPostForm } from "./edit-post-form";
import { Post } from "@/types/post";

interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPostModal({ post, isOpen, onClose, onSuccess }: EditPostModalProps) {
  const t = useTranslations('dashboard');

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('posts.edit')}</DialogTitle>
        </DialogHeader>
        <EditPostForm 
          post={post} 
          onClose={onClose}
          onSuccess={onSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
} 