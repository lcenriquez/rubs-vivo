'use client';

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFirestore } from "reactfire";
import { Post } from "@/types/post";
import { getPendingPosts, updatePostStatus } from "@/lib/posts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export function AdminDashboard() {
  const t = useTranslations('admin');
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const pendingPosts = await getPendingPosts(firestore);
      setPosts(pendingPosts);
    } catch (error) {
      console.error('Error loading pending posts:', error);
      toast.error(t('errors.loadPosts'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [firestore]);

  const handleApprove = async (post: Post) => {
    try {
      setIsSubmitting(true);
      await updatePostStatus(post.id, 'approved', firestore);
      setPosts(posts.filter(p => p.id !== post.id));
      toast.success(t('success.approved'));
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error(t('errors.approve'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPost) return;

    try {
      setIsSubmitting(true);
      await updatePostStatus(selectedPost.id, 'rejected', firestore, rejectionReason);
      setPosts(posts.filter(p => p.id !== selectedPost.id));
      setSelectedPost(null);
      setRejectionReason('');
      toast.success(t('success.rejected'));
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast.error(t('errors.reject'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        {t('noPendingPosts')}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('postedBy')}: {post.userId}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">{t('type')}</h3>
                <Badge>{t(`types.${post.type}`)}</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('description')}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {post.description}
                </p>
              </div>

              {post.photos && post.photos.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">{t('photos')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {post.photos.map((photo) => (
                      <img
                        key={photo.url}
                        src={photo.url}
                        alt=""
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApprove(post)}
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4 mr-2" />
                {t('approve')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSelectedPost(post)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                {t('reject')}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rejectTitle')}</DialogTitle>
            <DialogDescription>
              {t('rejectDescription')}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={t('rejectionPlaceholder')}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedPost(null)}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              {t('confirmReject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 