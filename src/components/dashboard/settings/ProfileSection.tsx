'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Eye, EyeOff, Loader2, KeyRound, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SettingRow } from './Shared';
import { userProfileSchema, passwordSchema, type UserProfileInput, type PasswordInput } from '@/lib/validations/profile';

interface ProfileSectionProps {
  initialData: { fullName: string; avatarUrl?: string };
  onUpdateProfile: (data: UserProfileInput) => Promise<void>;
  onUpdatePassword: (data: PasswordInput) => Promise<void>;
}

export function ProfileSection({ initialData, onUpdateProfile, onUpdatePassword }: ProfileSectionProps) {
  const t = useTranslations('Settings');
  const tAuth = useTranslations('Auth');
  const vt = useTranslations('Validation');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatarUrl || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    watch,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: { fullName: initialData.fullName }
  });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  const avatarFile = watch('avatar');

  React.useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const file = avatarFile[0] as unknown as File;
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [avatarFile]);

  return (
    <div className="space-y-8">
      {/* Public Profile Form */}
      <form id="profile-form" onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-6">
        <div className="flex flex-col items-center gap-4 mb-8 pt-2">
          <div className="relative group">
            <Avatar className="w-28 h-28 border-4 border-slate-100 dark:border-white/5 shadow-xl transition-transform group-hover:scale-105">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="bg-slate-100 dark:bg-white/5">
                <User className="w-14 h-14 text-slate-400" />
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-1 right-1 w-10 h-10 bg-[#FF5F15] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-[#1c120e]">
              <Camera className="w-5 h-5" />
              <input
                {...regProfile('avatar')}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{tAuth('avatar')}</p>
            <p className="text-[10px] text-slate-400 mt-1 italic">JPG, PNG ou WebP (Máx. 2MB)</p>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
          <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-primary">
            <User className="w-4 h-4" />
            Informações Pessoais
          </h3>
          <SettingRow label={tAuth('name')} description="Como você será visto no sistema" error={profileErrors.fullName && vt(profileErrors.fullName.message as any, { count: 3 })}>
            <input
              {...regProfile('fullName')}
              className="w-full sm:w-64 px-3 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/20 transition-all font-semibold"
            />
          </SettingRow>
        </div>
      </form>

      {/* Password Change Section (Formerly in Security) */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-indigo-500">
          <KeyRound className="w-4 h-4" />
          Segurança da Conta
        </h3>

        <form onSubmit={handlePasswordSubmit(async (data) => {
          await onUpdatePassword(data);
          resetPassword();
        })} className="space-y-4">
          <SettingRow
            label={t('changePassword')}
            description="Recomendamos uma senha forte com símbolos"
            error={passwordErrors.password && vt(passwordErrors.password.message as any, { count: 6 })}
          >
            <div className="relative w-full sm:w-64">
              <input
                {...regPassword('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Nova senha"
                className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </SettingRow>

          <SettingRow
            label="Confirmar Senha"
            error={passwordErrors.confirmPassword && "As senhas não coincidem"}
          >
            <div className="relative w-full sm:w-64">
              <input
                {...regPassword('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repita a nova senha"
                className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </SettingRow>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 text-white text-xs font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 active:scale-95"
            >
              {isSubmittingPassword ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              ATUALIZAR SENHA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
