'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { signup } from '@/lib/actions/auth';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Camera, User, Mail, Lock, ArrowLeft, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const vt = useTranslations('Validation');
  const params = useParams();
  const router = useRouter();
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg relative z-10"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
          {t('registerTitle')}
        </h2>
        <p className="text-muted-foreground font-medium">
          {t('registerSubtitle')}
        </p>
      </div>

      <div className="card glass p-8 rounded-[2.5rem] shadow-xl border border-white/10 dark:border-white/5">
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm mb-6 flex items-start gap-2"
            >
              <span className="shrink-0 mt-0.5">⚠️</span>
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-background shadow-xl ring-1 ring-primary/20">
                <AvatarImage src={avatarPreview || undefined} className="object-cover" />
                <AvatarFallback className="bg-muted">
                  <User className="w-12 h-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all ring-4 ring-background">
                <Camera className="w-5 h-5" />
                <input
                  {...register('avatar')}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {t('avatar')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <User className="w-4 h-4" />
                {t('name')}
              </label>
              <input
                {...register('fullName')}
                type="text"
                className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-destructive text-xs font-medium pl-1">
                  {vt(errors.fullName.message as any, { count: 3 })}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <Mail className="w-4 h-4" />
                {t('email')}
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-destructive text-xs font-medium pl-1">
                  {vt(errors.email.message as any)}
                </p>
              )}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
              <Lock className="w-4 h-4" />
              {t('password')}
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-destructive text-xs font-medium pl-1">
                {vt(errors.password.message as any, { count: 6 })}
              </p>
            )}
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isPending || isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            {(isPending || isSubmitting) ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{t('register')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            {t('hasAccount')}{' '}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/30 ml-1 inline-flex items-center gap-1 group"
            >
              {t('login')}
              <ArrowRight className="w-3 h-3 translate-y-[1px] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
