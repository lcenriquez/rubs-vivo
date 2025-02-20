"use client";

import { UserNav } from "@/components/navbar/user-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { useUser } from "reactfire";
import { ModeToggle } from "../ui/mode-toggle";

export const NavbarUserLinks: FC = () => {
  const { data, hasEmitted } = useUser();

  return (
    <>
      <ModeToggle />
      {hasEmitted && data ? (
        <>
          <Link href="/app" className={buttonVariants()}>
            Dashboard
          </Link>
          <UserNav />
        </>
      ) : (
        <>
          <Link href="/login" className={buttonVariants()}>
            Login / Register &rarr;
          </Link>
        </>
      )}
    </>
  );
};
