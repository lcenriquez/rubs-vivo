"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from 'next-intl';

const OrSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const t = useTranslations('auth');

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center space-x-4 text-muted-foreground",
        className
      )}
      {...props}
    >
      <Separator className="shrink" />
      <span className="whitespace-nowrap text-sm">{t('separator.text')}</span>
      <Separator className="shrink" />
    </div>
  );
});

OrSeparator.displayName = SeparatorPrimitive.Root.displayName;

export { OrSeparator };
