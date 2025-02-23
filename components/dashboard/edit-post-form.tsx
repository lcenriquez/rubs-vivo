'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useUser, useFirestore } from "reactfire";
import { Post } from "@/types/post";
import { updatePost } from "@/lib/posts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "./location-picker";
import { PhotoUpload } from "./photo-upload";

const formSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['dry', 'composting']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional()
  }),
  description: z.string().min(1),
  photos: z.array(z.object({
    url: z.string(),
    isCover: z.boolean()
  })).min(1).max(10)
});

type FormData = z.infer<typeof formSchema>;

interface EditPostFormProps {
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPostForm({ post, onClose, onSuccess }: EditPostFormProps) {
  const t = useTranslations('dashboard.form');
  const { data: user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      type: post.type,
      location: post.location,
      description: post.description,
      photos: post.photos
    }
  });

  async function onSubmit(data: FormData) {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      await updatePost(post.id, {
        ...data,
        userId: user.uid,
        status: 'pending'
      }, firestore);
      onSuccess();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('title.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('title.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('type.label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('type.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dry">{t('type.options.dry')}</SelectItem>
                  <SelectItem value="composting">{t('type.options.composting')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('location.label')}</FormLabel>
              <FormControl>
                <LocationPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description.label')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('description.placeholder')}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('photos.label')}</FormLabel>
              <FormControl>
                <PhotoUpload
                  value={field.value}
                  onChange={field.onChange}
                  userId={user?.uid}
                  postId={post.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {t('save')}
          </Button>
        </div>
      </form>
    </Form>
  );
} 