'use client';

import { useTranslations } from "next-intl";
import { useAdmin } from "@/hooks/use-admin";
import { AdminDashboard } from "@/components/admin/dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const t = useTranslations('admin');
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      // router.push('/');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <AdminDashboard />
    </div>
  );
} 