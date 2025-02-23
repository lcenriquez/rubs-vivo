'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from 'next-intl';
import { MyPosts } from "./my-posts";

export function DashboardTabs() {
  const t = useTranslations('dashboard');

  return (
    <Tabs defaultValue="my-posts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="my-posts">
          {t('tabs.myPosts')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-posts">
        <MyPosts />
      </TabsContent>
    </Tabs>
  );
} 