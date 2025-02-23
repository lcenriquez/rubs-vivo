'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { CreatePostForm } from "./create-post-form";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const t = useTranslations('dashboard');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('posts.create')}</DialogTitle>
        </DialogHeader>
        <CreatePostForm
          onClose={onClose}
          onSuccess={onSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
} 