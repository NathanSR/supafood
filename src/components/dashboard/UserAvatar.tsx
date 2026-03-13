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
import { LogOut, Settings, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useRouter } from '@/i18n/routing';
import { logout } from '@/app/actions/auth';
import { useParams } from 'next/navigation';

export function UserAvatar({ user }: { user: any }) {
  const t = useTranslations('Profile');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;

  const profile = user?.profile;
  const fullName = profile?.full_name || user?.email || 'User';
  const role = profile?.role || 'manager';
  const avatarUrl = profile?.avatar_url;
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout(locale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none focus:ring-0 group">
          <Avatar className="h-10 w-10 border-2 border-transparent group-data-[state=open]:border-primary transition-all overflow-hidden cursor-pointer">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
            <AvatarFallback className="bg-primary text-white font-bold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-surface-dark border-white/5 text-slate-100 p-2">
        <DropdownMenuLabel className="font-normal px-2 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{fullName}</p>
            <p className="text-xs leading-none text-slate-400">{user?.email}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-primary mt-1">{role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-primary rounded-lg cursor-pointer py-3 transition-colors">
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('settings')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white/5 focus:text-primary rounded-lg cursor-pointer py-3 transition-colors">
          <Building2 className="mr-2 h-4 w-4" />
          <span>{t('switchUnit')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="focus:bg-red-500/10 text-red-500 focus:text-red-500 rounded-lg cursor-pointer py-3 transition-colors font-bold"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

