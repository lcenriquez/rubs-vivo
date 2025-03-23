import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { DropletIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useTranslations } from 'next-intl';

export const NavBar: FC = () => {
  const t = useTranslations('nav');

  return (
    <>
      <div className="animate-in fade-in w-full">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                <DropletIcon className="w-8 h-8 mr-2 inline" />{" "}
                <span className="text-xl font-semibold tracking-tighter text-slate-800 dark:text-white mr-6">
                  RUBS
                </span>
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow">
              <div>
                <Link href="/composting-toilet" className={buttonVariants({ variant: "link" })}>
                  {t('compostingToilet')}
                </Link>
                <Link href="/map" className={buttonVariants({ variant: "link" })}>
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
      </div>
    </>
  );
};
