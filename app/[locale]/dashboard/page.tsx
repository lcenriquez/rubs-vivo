import { getTranslations } from 'next-intl/server';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <DashboardTabs />
    </div>
  );
} 