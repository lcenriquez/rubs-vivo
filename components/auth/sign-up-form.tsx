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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "reactfire";
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

interface SignUpFormProps {
  onShowLogin: () => void;
  onSignUp?: () => void;
}

export const SignUpForm: FC<SignUpFormProps> = ({ onShowLogin, onSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('auth');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const auth = useAuth();

  const signup = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user?.user.uid && user.user.email) {
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signup)}>
          <fieldset disabled={isLoading} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('signUp.passwordDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t('signUp.title')}</Button>
          </fieldset>
        </form>
      </Form>

      <p className="mt-4 text-sm">
        {t('signUp.alreadyJoined')}{" "}
        <Button variant="link" onClick={onShowLogin}>
          {t('signUp.signInInstead')}
        </Button>
      </p>
    </>
  );
};
