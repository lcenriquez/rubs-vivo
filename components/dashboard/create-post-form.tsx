'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useMemo } from "react";
import { useUser, useFirestore } from "reactfire";
import { LocationPicker } from "./location-picker";
import { PhotoUpload } from "./photo-upload";
import { createPost, generatePostRef } from "@/lib/posts";

// URL validation regex
const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

const formSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['dry', 'composting']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional()
  }),
  description: z.string().optional(),
  photos: z.array(z.object({
    url: z.string(),
    isCover: z.boolean()
  })).min(1).max(10),
  dryMixture: z.string().optional(),
  urineSystem: z.enum(['separated', 'not_separated']).default('not_separated'),
  hasCollectionService: z.boolean().default(false),
  collectionService: z.object({
    name: z.string().optional(),
    website: z.string().optional()
      .refine(val => !val || urlRegex.test(val), {
        message: "Please enter a valid URL"
      })
  }).optional(),
  showContactInfo: z.boolean().default(false),
  contactInfo: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional()
      .refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Please enter a valid email address"
      }),
    website: z.string().optional()
      .refine(val => !val || urlRegex.test(val), {
        message: "Please enter a valid URL"
      })
  }).optional()
});

type FormData = z.infer<typeof formSchema>;

interface CreatePostFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostForm({ onClose, onSuccess }: CreatePostFormProps) {
  const t = useTranslations('dashboard.form');
  const { data: user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate a real Firebase document ID
  const { id: postId } = useMemo(() => generatePostRef(firestore), [firestore]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      photos: [],
      dryMixture: '',
      hasCollectionService: false,
      collectionService: {
        name: '',
        website: ''
      },
      showContactInfo: false,
      contactInfo: {
        name: user?.displayName || '',
        phone: '',
        email: user?.email || '',
        website: ''
      }
    }
  });

  // Watch the showContactInfo and hasCollectionService values to conditionally render fields
  const showContactInfo = form.watch("showContactInfo");
  const hasCollectionService = form.watch("hasCollectionService");

  async function onSubmit(data: FormData) {
    if (!user) return;
    
    // Create a new object without the form control fields
    const postData = {
      title: data.title,
      type: data.type,
      location: data.location,
      description: data.description,
      photos: data.photos,
      dryMixture: data.dryMixture || '',
      urineSystem: data.urineSystem,
      userId: user.uid,
      status: 'pending' as const,
      author: {
        displayName: user.displayName,
        email: user.email
      }
    };
    
    // Only add collection service if the checkbox is checked
    if (data.hasCollectionService && data.collectionService) {
      // Ensure no undefined values in the object
      const collectionService = {
        name: data.collectionService.name || '',
        website: data.collectionService.website || ''
      };
      Object.assign(postData, { collectionService });
    }
    
    // Only add contact info if the checkbox is checked
    if (data.showContactInfo && data.contactInfo) {
      // Ensure no undefined values in the object
      const contactInfo = {
        name: data.contactInfo.name || '',
        phone: data.contactInfo.phone || '',
        email: data.contactInfo.email || '',
        website: data.contactInfo.website || ''
      };
      Object.assign(postData, { contactInfo });
    }
    
    try {
      setIsSubmitting(true);
      await createPost(postData, firestore, postId);
      onSuccess();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
        onKeyDown={(e) => {
          // Prevent form submission when pressing Enter on input fields
          if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}
      >
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
          name="urineSystem"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t('urineSystem.label')}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-6"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="separated" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t('urineSystem.options.separated')}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="not_separated" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t('urineSystem.options.not_separated')}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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
          name="dryMixture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('dryMixture.label')}</FormLabel>
              <FormDescription>{t('dryMixture.description')}</FormDescription>
              <FormControl>
                <Textarea 
                  placeholder={t('dryMixture.placeholder')}
                  className="min-h-[80px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Collection Service Checkbox */}
        <FormField
          control={form.control}
          name="hasCollectionService"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('collectionService.hasService.label')}
                </FormLabel>
                <FormDescription>
                  {t('collectionService.hasService.description')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Collection Service Fields - only shown if hasCollectionService is true */}
        {hasCollectionService && (
          <div className="space-y-4 pl-6 border-l-2 border-muted">
            <h3 className="text-lg font-medium">{t('collectionService.label')}</h3>
            
            <FormField
              control={form.control}
              name="collectionService.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('collectionService.name.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('collectionService.name.placeholder')} 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collectionService.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('collectionService.website.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('collectionService.website.placeholder')} 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Contact Information Checkbox */}
        <FormField
          control={form.control}
          name="showContactInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('contactInfo.hasInfo.label')}
                </FormLabel>
                <FormDescription>
                  {t('contactInfo.hasInfo.description')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Contact Information Fields - only shown if showContactInfo is true */}
        {showContactInfo && (
          <div className="space-y-4 pl-6 border-l-2 border-muted">
            <h3 className="text-lg font-medium">{t('contactInfo.label')}</h3>
            
            <FormField
              control={form.control}
              name="contactInfo.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contactInfo.name.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('contactInfo.name.placeholder')} 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contactInfo.phone.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('contactInfo.phone.placeholder')} 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contactInfo.email.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder={t('contactInfo.email.placeholder')} 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contactInfo.website.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('contactInfo.website.placeholder')} 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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
                  postId={postId}
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
            {t('submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
} 