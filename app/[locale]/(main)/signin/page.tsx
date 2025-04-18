import { AuthCard } from "@/components/auth-card";
import { ProviderLoginButtons } from "@/components/auth/provider-login-buttons";
import { OrSeparator } from "@/components/ui/or-separator";
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const t = await getTranslations('auth');

  return (
    <div className="grow flex flex-col items-center justify-center p-4">
      <section className="w-full max-w-md space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-center">
          RUBS
        </h1>
        <AuthCard />
        <OrSeparator />
        <ProviderLoginButtons />
      </section>
    </div>
  );
}

export const generateMetadata = async () => {
  const t = await getTranslations('auth');
  return {
    title: t('signIn.title')
  };
};
