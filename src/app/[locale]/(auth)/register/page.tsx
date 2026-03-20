'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { signup } from '@/lib/actions/auth';
import { useParams } from 'next/navigation';
import { Loader2, Camera, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const vt = useTranslations('Validation');
  const params = useParams();
  const locale = params?.locale as string;
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const avatarFile = watch('avatar');

  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const file = avatarFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [avatarFile]);

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('password', data.password);

    if (data.avatar && data.avatar[0]) {
      formData.append('avatar', data.avatar[0]);
    }

    startTransition(async () => {
      const result = await signup(formData, locale);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">{t('registerTitle')}</h1>
      <p className="text-slate-500 text-center -mt-4 mb-6">{t('registerSubtitle')}</p>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-slate-100 dark:border-white/5">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="bg-slate-100 dark:bg-white/5">
                <User className="w-12 h-12 text-slate-400" />
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
              <input
                {...register('avatar')}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-slate-500">{t('avatar')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('name')}</label>
          <input
            {...register('fullName')}
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">
              {vt(errors.fullName.message as any, { count: 3 })}
            </p>
          )}
        </div>
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
          {t('register')}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-500">
        {t('hasAccount')}{' '}
        <a href={`/${locale}/login`} className="text-primary font-bold hover:underline">
          {t('login')}
        </a>
      </div>
    </div>
  );
}
