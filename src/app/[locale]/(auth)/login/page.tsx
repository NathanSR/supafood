'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { login } from '@/lib/actions/auth';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowLeft, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const vt = useTranslations('Validation');
  const params = useParams();
  const router = useRouter();
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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
      className="w-full max-w-md relative z-10"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
          {t('loginTitle')}
        </h2>
        <p className="text-muted-foreground font-medium">
          {t('loginSubtitle')}
        </p>
      </div>

      <div className="card glass p-8 rounded-3xl shadow-xl border border-white/10 dark:border-white/5">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm mb-6 flex items-start gap-2"
          >
            <span className="shrink-0 mt-0.5">⚠️</span>
            {serverError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
              <Mail className="w-4 h-4" />
              {t('email')}
            </label>
            <div className="relative group">
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-foreground"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs font-medium pl-1">
                {vt(errors.email.message as any)}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
              <Lock className="w-4 h-4" />
              {t('password')}
            </label>
            <div className="relative group">
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-foreground"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-destructive text-xs font-medium pl-1">
                {vt(errors.password.message as any, { count: 6 })}
              </p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={isPending || isSubmitting}
            variants={itemVariants}
            className="w-full group bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden relative"
          >
            {(isPending || isSubmitting) ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{t('login')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/30 ml-1 inline-flex items-center gap-1 group"
            >
              {t('register')}
              <ArrowRight className="w-3 h-3 translate-y-[1px] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
