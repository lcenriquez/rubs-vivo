import { Work_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { MyFirebaseProvider } from "@/components/firebase-providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const font = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: 'RUBS Vivo | %s',
    default: 'RUBS Vivo'
  }
};

export function generateStaticParams() {
  return [{locale: 'es'}, {locale: 'en'}];
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();

  if (locale !== 'es' && locale !== 'en') {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={cn(font.className)}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MyFirebaseProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
          </MyFirebaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 