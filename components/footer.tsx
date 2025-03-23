'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './ui/mode-toggle';
import { LanguageToggle } from './ui/language-toggle';
import { DropletIcon } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const pathname = usePathname() || '';
  const locale = pathname.split('/')[1];

  const navigation = [
    { name: t('map'), href: `/${locale}/map` },
    { name: t('compostingToilet'), href: `/${locale}/composting-toilet` },
  ];

  const social = [
    { name: 'GitHub', href: 'https://github.com/lcenriquez/rubs-vivo' },
    { name: 'Instagram', href: 'https://www.instagram.com/rubsvivo/' },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100064272806171' },
  ];

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <DropletIcon className="h-6 w-6" />
              <span className="font-semibold text-lg">RUBS</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Red de Usuarios de Baño Seco
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('navigation')}</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('legal')}</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href={`/${locale}/privacy`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('privacyNotice')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Settings & Social */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('settings')}</h3>
            <div className="space-y-6">
              {/* Settings */}
              <div className="flex items-center gap-4">
                <ModeToggle />
                <LanguageToggle />
              </div>
              
              {/* Social */}
              <div>
                <h4 className="text-sm font-medium mb-3">{t('social')}</h4>
                <div className="flex flex-wrap gap-4">
                  {social.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 py-6 border-t text-center text-sm">
          <p className="text-center text-sm leading-loose">
            {t('poweredBy')}{' '}
            <a
              href="https://ungranitodetierra.org"
              target="_blank"
              className="font-medium underline underline-offset-4"
            >
              Un Granito de Tierra, A.C.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
