'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Store, ArrowRight, Loader2, LogOut, Sparkles } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { createRestaurant } from '@/app/actions/restaurant';
import { logout } from '@/app/actions/auth';
import { onboardingRestaurantSchema, type OnboardingRestaurantInput } from '@/lib/validations/profile';
import { motion } from 'framer-motion';

export function OnboardingClient() {
  const t = useTranslations('Onboarding');
  const vt = useTranslations('Validation');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingRestaurantInput>({
    resolver: zodResolver(onboardingRestaurantSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      currency: 'BRL',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR'
    }
  });

  const onSubmit = async (data: OnboardingRestaurantInput) => {
    setError('');
    try {
      const result = await createRestaurant(data);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push('/home');
    } catch {
      setError(t('errorGeneric'));
    }
  };

  const handleLogout = async () => {
    await logout(locale);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 dark:from-background-dark dark:via-background-dark dark:to-background-dark p-4 font-sans text-slate-900 dark:text-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 space-y-6">

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center space-y-3"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF5F15] to-[#FF8A50] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF5F15]/20">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black">{t('title')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('subtitle')}
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-bold mb-2">{t('restaurantNameLabel')}</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('name')}
                  placeholder={t('restaurantNamePlaceholder')}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#FF5F15]/20 focus:border-[#FF5F15] transition-all font-semibold"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{vt(errors.name.message as any, { count: 3 })}</p>}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-bold text-center bg-red-50 dark:bg-red-500/10 p-3 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <input type="hidden" {...register('currency')} />
            <input type="hidden" {...register('timezone')} />
            <input type="hidden" {...register('language')} />

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FF5F15] to-[#FF8A50] font-bold text-white shadow-lg shadow-[#FF5F15]/25 transition-all hover:shadow-[#FF5F15]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative flex items-center justify-center gap-2 px-4 py-3.5">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('createButton')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="pt-2"
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors py-2 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logoutButton')}</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
