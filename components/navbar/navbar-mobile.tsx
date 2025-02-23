"use client";

import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MenuIcon } from "lucide-react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const NavbarMobile = () => {
  const t = useTranslations('nav');

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="-mr-4">
              <MenuIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-col p-1">
              <Link href="/map" className={buttonVariants({ variant: "link" })}>
                {t('map')}
              </Link>
              <div className="flex flex-col mb-0.5">
                <NavbarUserLinks />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
