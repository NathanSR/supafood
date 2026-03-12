'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Utensils,
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  BarChart2,
  Settings
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const navItems = [
    { name: t('home'), href: '/', icon: LayoutDashboard },
    { name: t('menu'), href: '/menu', icon: BookOpen },
    { name: t('orders'), href: '/orders', icon: ShoppingBag },
    { name: t('analytics'), href: '/analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-surface-dark flex flex-col h-full">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
          <Utensils className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Supafood</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Restaurant Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          // Remove locale from pathname for comparison
          const isActive = pathname.replace(/^\/[^\/]+/, '') === item.href || (pathname.replace(/^\/[^\/]+/, '') === '' && item.href === '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-semibold text-sm",
                isActive
                  ? "sidebar-item-active"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-[22px] h-[22px]", isActive ? "text-primary" : "")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
