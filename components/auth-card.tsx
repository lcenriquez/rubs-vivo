"use client";

import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "reactfire";
import { useTranslations } from 'next-intl';

export const AuthCard = ({ isSignUp = false }) => {
  const [isShowingSignUp, setIsShowingSignUp] = useState<boolean>(isSignUp);
  const { data: user } = useUser();
  const router = useRouter();
  const t = useTranslations('auth');

  useEffect(() => {
    if (user) {
      router.push("/app");
    }
  }, [user]);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 px-4 py-4 sm:px-6">
        <CardTitle className="text-2xl">
          {isShowingSignUp ? t('signUp.title') : t('signIn.title')}
        </CardTitle>
        <CardDescription>
          {isShowingSignUp 
            ? t('signUp.description', { defaultMessage: 'Join our community of eco-conscious users' })
            : t('signIn.description', { defaultMessage: 'Welcome back!' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6">
        {isShowingSignUp ? (
          <SignUpForm onShowLogin={() => setIsShowingSignUp(false)} />
        ) : (
          <SignInForm onShowSignUp={() => setIsShowingSignUp(true)} />
        )}
      </CardContent>
    </Card>
  );
};
