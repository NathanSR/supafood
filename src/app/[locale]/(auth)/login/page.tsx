'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { login } from '@/app/actions/auth';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const vt = useTranslations('Validation');
  const params = useParams();
  const locale = params?.locale as string;
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    startTransition(async () => {
      const result = await login(formData, locale);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">{t('loginTitle')}</h1>
      <p className="text-slate-500 text-center -mt-4 mb-6">{t('loginSubtitle')}</p>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('email')}</label>
          <input 
            {...register('email')}
            type="email" 
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100" 
            placeholder="john@example.com" 
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {vt(errors.email.message as any)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('password')}</label>
          <input 
            {...register('password')}
            type="password" 
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100" 
            placeholder="••••••••" 
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {vt(errors.password.message as any, { count: 6 })}
            </p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isPending || isSubmitting}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {(isPending || isSubmitting) && <Loader2 className="w-4 h-4 animate-spin" />}
          {t('login')}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-500">
        {t('noAccount')}{' '}
        <a href={`/${locale}/register`} className="text-primary font-bold hover:underline">
          {t('register')}
        </a>
      </div>
    </div>
  );
}
