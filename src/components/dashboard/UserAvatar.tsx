'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, Building2, Check, LayoutGrid, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useRouter } from '@/i18n/routing';
import { logout } from '@/lib/actions/auth';
import { switchRestaurant } from '@/lib/actions/restaurant';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export function UserAvatar({ user, restaurants, activeRestaurant }: { user: any, restaurants?: any[], activeRestaurant?: any }) {
  const t = useTranslations('Profile');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;

  const profile = user?.profile;
  const fullName = profile?.full_name || user?.email || t('defaultUser');
  const role = profile?.role || 'manager';
  const avatarUrl = profile?.avatar_url;
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout(locale);
  };

  const handleSwitchRestaurant = async (id: string) => {
    await switchRestaurant(id);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="relative group outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-all">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-0.5 rounded-full bg-slate-200 dark:bg-white/10 group-data-[state=open]:bg-primary transition-colors duration-300"
          >
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-all overflow-hidden cursor-pointer">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />}
              <AvatarFallback className="bg-primary text-white font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 p-2 mt-2 border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl bg-background backdrop-blur-xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      >
        <div className="px-3 py-4 mb-2 rounded-xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mx-1">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-md">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
                <AvatarFallback className="bg-primary text-white font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold truncate text-slate-900 dark:text-white leading-none mb-1">{fullName}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-2">{user?.email}</p>
              <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-primary/10 rounded-full w-fit border border-primary/20">
                <Briefcase className="h-3 w-3 text-primary" />
                <p className="text-[10px] uppercase font-bold text-primary tracking-tight">
                  {t(role)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-1 space-y-0.5">
          <DropdownMenuItem asChild className="rounded-lg py-2.5 px-3 focus:bg-primary/10 focus:text-primary dark:focus:bg-primary/20 text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-200 group border border-transparent focus:border-primary/10">
            <Link href="/settings" className="flex items-center w-full">
              <div className="mr-3 p-1.5 rounded-md bg-slate-100 dark:bg-white/5 group-focus:bg-primary/20 transition-colors">
                <Settings className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm">{t('settings')}</span>
            </Link>
          </DropdownMenuItem>
        </div>

        {restaurants && restaurants.length > 0 && (
          <div className="mt-3">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                <LayoutGrid className="h-3 w-3 mr-1.5" />
                {t('switchUnit')}
              </span>
            </div>
            <div className="space-y-0.5 px-1 max-h-48 overflow-y-auto custom-scrollbar">
              {restaurants.map((restaurant) => {
                const isActive = activeRestaurant?.id === restaurant.id;
                return (
                  <DropdownMenuItem
                    key={restaurant.id}
                    onClick={() => handleSwitchRestaurant(restaurant.id)}
                    className={cn(
                      "rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200 flex items-center justify-between group border border-transparent",
                      isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center min-w-0">
                      <div className={cn(
                        "mr-3 p-1.5 rounded-md transition-colors",
                        isActive ? "bg-primary/10" : "bg-slate-100 dark:bg-white/5"
                      )}>
                        <Building2 className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                      </div>
                      <span className={cn(
                        "text-sm truncate font-medium",
                        isActive ? "font-bold" : ""
                      )}>
                        {restaurant.name}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-dot"
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </div>
          </div>
        )}

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/10 mx-2 mt-3 mb-2" />

        <div className="px-1 pb-1">
          <DropdownMenuItem
            onClick={handleLogout}
            className="rounded-lg py-3 px-3 focus:bg-red-50 dark:focus:bg-red-500/10 text-red-500 font-bold cursor-pointer transition-all duration-200 group border border-transparent focus:border-red-200/20"
          >
            <div className="mr-3 p-1.5 rounded-md bg-red-50 dark:bg-red-500/10 group-focus:bg-red-100 dark:group-focus:bg-red-500/20 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-sm">{t('logout')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

