import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useTranslations } from 'next-intl';

export const NavBar: FC = () => {
  const t = useTranslations('nav');

  const linkClass =
    "rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-900/60 dark:hover:text-emerald-100";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <nav className="container px-4 md:px-8 py-3">
        <div className="flex items-center">
          <Link href="/" className="group flex items-center gap-2 mr-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-lime-500 text-white shadow-md transition-transform group-hover:rotate-6">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight">RUBS</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Vivo</span>
            </span>
          </Link>
          <div className="hidden md:flex justify-between grow items-center">
            <div className="flex items-center gap-1">
              <Link href="/composting-toilet" className={linkClass}>
                {t('compostingToilet')}
              </Link>
              <Link href="/map" className={linkClass}>
                {t('map')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <NavbarUserLinks />
            </div>
          </div>
          <div className="grow md:hidden flex justify-end">
            <NavbarMobile />
          </div>
        </div>
      </nav>
    </header>
  );
};
