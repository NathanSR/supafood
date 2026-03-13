'use client';

import React from 'react';
import { Menu, Utensils } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import { useTranslations } from 'next-intl';

export function MobileNav() {
  const t = useTranslations('Navigation');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-600 dark:text-slate-300">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('menuToggle')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-none bg-background-light dark:bg-background-dark w-72">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Sidebar className="w-full border-none shadow-none" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
