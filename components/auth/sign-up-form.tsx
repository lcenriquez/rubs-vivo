'use client';

import * as React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth, useFirestore } from "reactfire";
import { useTranslations } from 'next-intl';
import { doc, setDoc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
});

interface SignUpFormProps {
  onShowLogin: () => void;
  onSignUp?: () => void;
}

export const SignUpForm: FC<SignUpFormProps> = ({ onShowLogin, onSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('auth');
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const signup = async ({ email, password, firstName, lastName }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store user data in Firestore
      if (userCredential?.user) {
        // Update display name in Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: `${firstName.trim()} ${lastName.trim()}`
        });

        await setDoc(doc(firestore, 'users', userCredential.user.uid), {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        toast({ title: t('signUp.success') });
        onSignUp?.();
      }
    } catch (err: any) {
      if ("code" in err && err.code.includes("already")) {
        toast({ title: t('signUp.errors.userExists') });
      } else {
        toast({ 
          title: t('signUp.errors.default'),
          description: `${err}`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signup)}>
          <fieldset disabled={isLoading} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('firstName')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('lastName')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {t('signUp.emailDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {t('signUp.passwordDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2">{t('signUp.title')}</Button>
          </fieldset>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <p className="text-sm">
          {t('signUp.alreadyJoined')}{" "}
          <Button variant="link" onClick={onShowLogin} className="p-0 h-auto text-sm font-medium">
            {t('signUp.signInInstead')}
          </Button>
        </p>
      </div>
    </div>
  );
};
