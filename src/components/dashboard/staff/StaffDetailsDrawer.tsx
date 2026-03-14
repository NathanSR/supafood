'use client';

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
} from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import { 
  Phone, 
  Mail,
  User,
  Briefcase,
  Clock,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface StaffDetailsDrawerProps {
  member: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const roleColors: Record<string, string> = {
  chef: 'bg-primary/10 text-primary border-primary/20',
  cook: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  waiter: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  cashier: 'bg-green-500/10 text-green-600 border-green-500/20',
  manager: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  cleaner: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const shiftColors: Record<string, string> = {
  morning: 'text-amber-500 bg-amber-500/10',
  afternoon: 'text-blue-500 bg-blue-500/10',
  evening: 'text-purple-500 bg-purple-500/10',
  night: 'text-indigo-400 bg-indigo-400/10',
};

export function StaffDetailsDrawer({ member, isOpen, onClose }: StaffDetailsDrawerProps) {
  const t = useTranslations('Staff');

  if (!member) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto no-scrollbar border-none bg-card dark:bg-card p-0">
        {/* Header/Cover */}
        <div className="relative h-48 w-full bg-primary/5 dark:bg-primary/10">
          <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-card to-transparent" />
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] bg-card dark:bg-card shadow-2xl flex items-center justify-center text-4xl overflow-hidden border-4 border-card dark:border-card">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div className={`absolute -right-1 -bottom-1 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${
                member.status === 'on_duty' ? 'bg-green-500' : 'bg-slate-400'
              }`}>
                <div className={`w-2 h-2 rounded-full bg-white ${member.status === 'on_duty' && 'animate-pulse'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pt-16 pb-8 space-y-8">
          {/* Main Info */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{member.name}</h2>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider ${roleColors[member.role]}`}>
                {t(member.role as any)}
              </span>
              <span className="text-xs font-bold text-slate-400">ID: {member.id.split('-')[0].toUpperCase()}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[24px] border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('performance')}</p>
              <div className="flex items-center gap-2">
                < Award className="w-5 h-5 text-amber-500" />
                <p className="text-xl font-black text-slate-900 dark:text-white">{member.performance || 0}%</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[24px] border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('shift')}</p>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <p className={`text-sm font-bold uppercase tracking-widest ${shiftColors[member.shift].split(' ')[0]}`}>
                  {t(member.shift as any)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
               <User className="w-4 h-4 text-primary" />
               {t('contactInfo') || 'Informações de Contato'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t('email')}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t('phone')}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{member.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
               <Briefcase className="w-4 h-4 text-primary" />
               {t('workInfo') || 'Informações de Trabalho'}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">{t('hireDate')}</span>
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                  {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">{t('status')}</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                  member.status === 'on_duty' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {member.status === 'on_duty' ? t('onDuty') : t('offDuty')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
            >
              {t('close') || 'Fechar Visualização'}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
