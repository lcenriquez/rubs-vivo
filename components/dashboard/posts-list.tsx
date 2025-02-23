'use client';

import { useEffect, useState } from "react";
import { useUser, useFirestore } from "reactfire";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types/post";
import { getUserPosts } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { EditPostModal } from "@/components/dashboard/edit-post-modal";
import { ViewPostModal } from "@/components/dashboard/view-post-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deletePost } from "@/lib/posts";

interface PostsListProps {
  onRefresh: () => void;
}

export function PostsList({ onRefresh }: PostsListProps) {
  const t = useTranslations('dashboard');
  const { data: user } = useUser();
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshPosts = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const userPosts = await getUserPosts(user.uid, firestore);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, [user, firestore]);

  const handleDelete = async () => {
    if (!deletingPost) return;
    
    try {
      setIsDeleting(true);
      await deletePost(deletingPost.id, deletingPost.photos, firestore);
      setPosts(posts.filter(p => p.id !== deletingPost.id));
      setDeletingPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        {t('posts.empty')}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="aspect-video relative">
            {post.photos?.find(p => p.isCover)?.url && (
              <img
                src={post.photos.find(p => p.isCover)?.url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}
            <Badge 
              className="absolute top-2 right-2"
              variant={
                post.status === 'approved' ? 'default' :
                post.status === 'rejected' ? 'destructive' :
                'secondary'
              }
            >
              {t(`posts.status.${post.status}`)}
            </Badge>
            <div className="absolute top-2 left-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setViewingPost(post)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingPost(post)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeletingPost(post)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.description}
            </p>
          </div>
        </Card>
      ))}
      <EditPostModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSuccess={() => {
          setEditingPost(null);
          onRefresh();
        }}
      />
      <ViewPostModal
        post={viewingPost}
        isOpen={!!viewingPost}
        onClose={() => setViewingPost(null)}
      />
      <AlertDialog open={!!deletingPost} onOpenChange={() => setDeletingPost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('posts.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('posts.delete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('posts.delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('posts.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 