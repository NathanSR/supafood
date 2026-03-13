'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { signup } from '@/app/actions/auth';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Camera, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const params = useParams();
  const locale = params?.locale as string;
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await signup(formData, locale);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">{t('registerTitle')}</h1>
      <p className="text-slate-500 text-center -mt-4 mb-6">{t('registerSubtitle')}</p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
                type="file" 
                name="avatar" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p className="text-xs text-slate-500">{t('avatar')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('name')}</label>
          <input 
            name="fullName"
            type="text" 
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100" 
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('email')}</label>
          <input 
            name="email"
            type="email" 
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100" 
            placeholder="john@example.com" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('password')}</label>
          <input 
            name="password"
            type="password" 
            required
            minLength={6}
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100" 
            placeholder="••••••••" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
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
