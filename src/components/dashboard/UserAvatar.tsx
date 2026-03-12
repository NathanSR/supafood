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

export function UserAvatar() {
  const t = useTranslations('Profile');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none focus:ring-0 group">
          <Avatar className="h-10 w-10 border-2 border-transparent group-data-[state=open]:border-primary transition-all overflow-hidden cursor-pointer">
            <AvatarImage 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvUFGlOgtvwgHhCEScB1fQGmib40BV6FmYvfi3B5LWPSMglw9fWfblzUH37nQSA6Req66BxF64rQl2g9G3kqaKSCHHCW2wn643tSHSIDqvyZhPuGYcRHFqIaJWnJJ9JN0KOOLCkANdajH2T_VndcMgqTfnYa9QSMEgWvrqHeT4yVaOlaoigMAksFB2r1VL3YH64oCBIGVvaEjphjxkYtf-tvoTOuIV4e3SrX4gmpq8bihnjYK5juBMh6fBCV_jepG-fy_WoJFQduE" 
              alt="Alex Rivera"
            />
            <AvatarFallback className="bg-primary text-white font-bold">AR</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-surface-dark border-white/5 text-slate-100 p-2">
        <DropdownMenuLabel className="font-normal px-2 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">Alex Rivera</p>
            <p className="text-xs leading-none text-slate-400">alex.rivera@supafood.io</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-primary mt-1">{t('manager')}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem className="focus:bg-white/5 focus:text-primary rounded-lg cursor-pointer py-3 transition-colors">
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white/5 focus:text-primary rounded-lg cursor-pointer py-3 transition-colors">
          <Building2 className="mr-2 h-4 w-4" />
          <span>{t('switchUnit')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem className="focus:bg-red-500/10 text-red-500 focus:text-red-500 rounded-lg cursor-pointer py-3 transition-colors font-bold">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
