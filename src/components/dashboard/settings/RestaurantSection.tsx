'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Store, Mail, Phone, MapPin, Coins, Clock, BookOpen } from 'lucide-react';
import { SettingRow } from './Shared';
import { restaurantSettingsSchema, type RestaurantSettingsInput } from '@/lib/validations/profile';

interface RestaurantSectionProps {
  initialData: RestaurantSettingsInput;
  onUpdate: (data: RestaurantSettingsInput) => Promise<void>;
}

export function RestaurantSection({ initialData, onUpdate }: RestaurantSectionProps) {
  const t = useTranslations('Settings');
  const vt = useTranslations('Validation');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantSettingsInput>({
    resolver: zodResolver(restaurantSettingsSchema),
    defaultValues: initialData
  });

  return (
    <form id="restaurant-form" onSubmit={handleSubmit(onUpdate)} className="space-y-6">
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-[#FF5F15]">
          <Store className="w-4 h-4" />
          {t('restaurantProfile')}
        </h3>
        
        <SettingRow label={t('restaurantName')} description={t('restaurantNameDescription')} error={errors.name && vt(errors.name.message as any, { count: 3 })}>
          <div className="relative w-full sm:w-80">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('name')}
              className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#FF5F15]/20 transition-all font-semibold"
            />
          </div>
        </SettingRow>

        <SettingRow label={t('restaurantEmail')} error={errors.email && vt(errors.email.message as any)}>
          <div className="relative w-full sm:w-80">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('email')}
              className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#FF5F15]/20 transition-all font-semibold"
            />
          </div>
        </SettingRow>

        <SettingRow label={t('restaurantPhone')} error={errors.phone && vt(errors.phone.message as any)}>
          <div className="relative w-full sm:w-80">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('phone')}
              className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#FF5F15]/20 transition-all font-semibold"
            />
          </div>
        </SettingRow>

        <SettingRow label={t('restaurantAddress')} error={errors.address && vt(errors.address.message as any)}>
          <div className="relative w-full sm:w-80">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('address')}
              className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#FF5F15]/20 transition-all font-semibold"
            />
          </div>
        </SettingRow>
      </div>

      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-indigo-500">
          <BookOpen className="w-4 h-4" />
          {t('regionalFinance')}
        </h3>

        <SettingRow label={t('currency')} description={t('currencyDescription')}>
          <div className="relative w-full sm:w-80">
            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <select {...register('currency')} className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all font-bold appearance-none text-slate-800 dark:text-slate-100">
              <option value="BRL">BRL — Real Brasileiro</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
        </SettingRow>

        <SettingRow label={t('timezone')} description={t('timezoneDescription')}>
          <div className="relative w-full sm:w-80">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <select {...register('timezone')} className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all font-bold appearance-none text-slate-800 dark:text-slate-100">
              <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
            </select>
          </div>
        </SettingRow>

        <SettingRow label={t('language')} description={t('restaurantLanguageDescription')}>
          <div className="relative w-full sm:w-80">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <select {...register('language')} className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all font-bold appearance-none text-slate-800 dark:text-slate-100">
              <option value="pt-BR">{t('ptBR')}</option>
              <option value="en">{t('en')}</option>
            </select>
          </div>
        </SettingRow>
      </div>
    </form>
  );
}
