'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createRestaurant, updateRestaurant } from '@/lib/actions/restaurant';
import { Loader2, X, Building2, Mail, Phone, MapPin, Globe, Clock, DollarSign } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface RestaurantFormProps {
  initialData?: any;
  onClose: () => void;
  isOpen: boolean;
}

const currencies = ['BRL', 'USD', 'EUR', 'GBP', 'ARS', 'CLP', 'MXN'];
const timezones = [
  'America/Sao_Paulo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Argentina/Buenos_Aires',
  'America/Santiago',
  'America/Mexico_City',
  'Europe/London',
  'Europe/Paris',
];
const languages = ['pt-BR', 'en', 'es'];

export function RestaurantForm({ initialData, onClose, isOpen }: RestaurantFormProps) {
  const t = useTranslations('Restaurants');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        address: formData.get('address') as string || null,
        currency: formData.get('currency') as string,
        timezone: formData.get('timezone') as string,
        language: formData.get('language') as string,
      };

      let result;
      if (initialData?.id) {
        result = await updateRestaurant(initialData.id, data);
      } else {
        result = await createRestaurant(data);
      }

      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('editRestaurant') : t('addRestaurant')}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('name')}</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              name="name"
              defaultValue={initialData?.name}
              required
              placeholder={t('namePlaceholder')}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                name="email"
                type="email"
                defaultValue={initialData?.email}
                placeholder="email@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('phone')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                name="phone"
                defaultValue={initialData?.phone}
                placeholder="(00) 00000-0000"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('address')}</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              name="address"
              defaultValue={initialData?.address}
              placeholder={t('addressPlaceholder')}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('currency')}</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                name="currency"
                defaultValue={initialData?.currency || 'BRL'}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
              >
                {currencies.map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('timezone')}</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                name="timezone"
                defaultValue={initialData?.timezone || 'America/Sao_Paulo'}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{tz.split('/').pop()?.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('language')}</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                name="language"
                defaultValue={initialData?.language || 'pt-BR'}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
              >
                {languages.map(l => (
                  <option key={l} value={l} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t(l.replace('-', '') as any)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 text-sm"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {initialData ? t('saveChanges') : t('addRestaurant')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
