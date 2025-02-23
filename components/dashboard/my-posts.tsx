'use client';

import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { Plus } from "lucide-react";
import { useState, useCallback } from "react";
import { CreatePostModal } from "./create-post-modal";
import { PostsList } from "./posts-list";

export function MyPosts() {
  const t = useTranslations('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPosts = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleSuccess = () => {
    setIsModalOpen(false);
    refreshPosts();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t('tabs.myPosts')}</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('posts.create')}
        </Button>
      </div>
      <PostsList key={refreshKey} onRefresh={refreshPosts} />
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 