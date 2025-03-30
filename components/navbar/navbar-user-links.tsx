"use client";

import { UserNav } from "@/components/navbar/user-nav";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "reactfire";

export const NavbarUserLinks: FC = () => {
  const t = useTranslations('auth');
  const { data, hasEmitted } = useUser();

  return (
    <>
      {hasEmitted && data ? (
        <>
          <Link href="/app" className={buttonVariants()}>
            {t('dashboard.title')}
          </Link>
          <UserNav />
        </>
      ) : (
        <>
          <Link href="/signin" className={buttonVariants()}>
            {t('signIn.title')} &rarr;
          </Link>
        </>
      )}
    </>
  );
};
