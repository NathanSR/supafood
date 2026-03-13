'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User,
  Store,
  Bell,
  Palette,
  Shield,
  CreditCard,
  Globe,
  Check,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Loader2,
  Camera
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { restaurantSettingsSchema, passwordSchema, userProfileSchema, type RestaurantSettingsInput, type PasswordInput, type UserProfileInput } from '@/lib/validations/profile';
import { updateProfile } from '@/app/actions/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Section = 'profile' | 'restaurant' | 'notifications' | 'appearance' | 'security' | 'billing';

const sectionConfig: { key: Section; icon: React.ElementType; color: string; bg: string }[] = [
  { key: 'profile', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { key: 'restaurant', icon: Store, color: 'text-primary', bg: 'bg-primary/10' },
  { key: 'notifications', icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'appearance', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { key: 'security', icon: Shield, color: 'text-green-500', bg: 'bg-green-500/10' },
  { key: 'billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      type="button"
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
    >
      <motion.span
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  );
}

function SettingRow({ label, description, children, error }: { label: string; description?: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
      {error && <p className="text-red-500 text-[10px] mt-1 text-right">{error}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const tAuth = useTranslations('Auth');
  const t = useTranslations('Settings');
  const vt = useTranslations('Validation');
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // For profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    watch: watchProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: 'John Manager',
    }
  });

  const avatarFile = watchProfile('avatar');

  React.useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const file = avatarFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [avatarFile]);

  // For restaurant form
  const {
    register: registerRestaurant,
    handleSubmit: handleSubmitRestaurant,
    formState: { errors: restaurantErrors, isSubmitting: isSubmittingRestaurant },
  } = useForm<RestaurantSettingsInput>({
    resolver: zodResolver(restaurantSettingsSchema),
    defaultValues: {
      name: 'SUPAFOOD Restaurant',
      email: 'contato@supafood.com',
      phone: '(11) 3456-7890',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      currency: 'BRL — Real Brasileiro',
      timezone: 'America/Sao_Paulo (GMT-3)',
      language: 'Português (Brasil)',
    }
  });

  // For password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  // Generic Notification states
  const [emailNotif, setEmailNotif] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [lowStock, setLowStock] = useState(false);
  const [dailyReport, setDailyReport] = useState(true);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const onProfileSubmit = async (data: UserProfileInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0]);
      }

      const result = await updateProfile(formData);
      if (result?.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  };

  const onRestaurantSubmit = async (data: RestaurantSettingsInput) => {
    startTransition(async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const onPasswordSubmit = async (data: PasswordInput) => {
    startTransition(async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <form id="profile-form" onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
             <div className="flex flex-col items-center gap-4 mb-6 pt-2">
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
                    {...registerProfile('avatar')}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 font-bold">{tAuth('avatar')}</p>
            </div>
            <SettingRow label={tAuth('name')} error={profileErrors.fullName && vt(profileErrors.fullName.message as any, { count: 3 })}>
              <input
                {...registerProfile('fullName')}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
              />
            </SettingRow>
          </form>
        );
      case 'restaurant':
        return (
          <form id="restaurant-form" onSubmit={handleSubmitRestaurant(onRestaurantSubmit)} className="space-y-0">
            <SettingRow label={t('restaurantName')} error={restaurantErrors.name && vt(restaurantErrors.name.message as any, { count: 3 })}>
              <input
                {...registerRestaurant('name')}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
              />
            </SettingRow>
            <SettingRow label={t('restaurantEmail')} error={restaurantErrors.email && vt(restaurantErrors.email.message as any)}>
              <input
                {...registerRestaurant('email')}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
              />
            </SettingRow>
            <SettingRow label={t('restaurantPhone')} error={restaurantErrors.phone && vt(restaurantErrors.phone.message as any)}>
              <input
                {...registerRestaurant('phone')}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
              />
            </SettingRow>
            <SettingRow label={t('restaurantAddress')} error={restaurantErrors.address && vt(restaurantErrors.address.message as any)}>
              <input
                {...registerRestaurant('address')}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
              />
            </SettingRow>
            <SettingRow label={t('currency')} error={restaurantErrors.currency && vt(restaurantErrors.currency.message as any)}>
              <select {...registerRestaurant('currency')} className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium">
                <option>BRL — Real Brasileiro</option>
                <option>USD — US Dollar</option>
                <option>EUR — Euro</option>
              </select>
            </SettingRow>
            <SettingRow label={t('timezone')} error={restaurantErrors.timezone && vt(restaurantErrors.timezone.message as any)}>
              <select {...registerRestaurant('timezone')} className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium">
                <option>America/Sao_Paulo (GMT-3)</option>
                <option>America/New_York (GMT-5)</option>
                <option>Europe/London (GMT+0)</option>
              </select>
            </SettingRow>
            <SettingRow label={t('language')} error={restaurantErrors.language && vt(restaurantErrors.language.message as any)}>
              <select {...registerRestaurant('language')} className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium">
                <option>Português (Brasil)</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </SettingRow>
          </form>
        );

      case 'notifications':
        return (
          <div className="space-y-0">
            <SettingRow label={t('emailNotifications')} description="Receba notificações por e-mail">
              <Toggle enabled={emailNotif} onChange={setEmailNotif} />
            </SettingRow>
            <SettingRow label={t('orderAlerts')} description="Alerta quando um novo pedido chega">
              <Toggle enabled={orderAlerts} onChange={setOrderAlerts} />
            </SettingRow>
            <SettingRow label={t('lowStockAlerts')} description="Notificação quando o estoque estiver baixo">
              <Toggle enabled={lowStock} onChange={setLowStock} />
            </SettingRow>
            <SettingRow label={t('dailyReport')} description="Receba o relatório diário todo dia às 23h">
              <Toggle enabled={dailyReport} onChange={setDailyReport} />
            </SettingRow>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-0">
            <SettingRow label={t('theme')} description="Escolha o tema da interface">
              <div className="flex items-center gap-2">
                {([
                  { value: 'light', icon: Sun, label: t('light') },
                  { value: 'dark', icon: Moon, label: t('dark') },
                  { value: 'system', icon: Monitor, label: t('system') },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    type="button"
                    className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                      theme === opt.value
                         ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-0">
            <SettingRow label={t('changePassword')} description="Atualize sua senha regularmente" error={passwordErrors.password && vt(passwordErrors.password.message as any, { count: 6 })}>
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="flex items-center gap-2">
                <div className="relative">
                  <input
                    {...registerPassword('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-48 pl-3 pr-10 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmittingPassword}
                  className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSubmittingPassword ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Alterar'}
                </button>
              </form>
            </SettingRow>
            <SettingRow label={t('twoFactor')} description="Adicione uma camada extra de segurança">
              <Toggle enabled={twoFactor} onChange={setTwoFactor} />
            </SettingRow>
            <SettingRow label={t('sessions')} description="2 sessões ativas no momento">
              <button type="button" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Gerenciar <ChevronRight className="w-4 h-4" />
              </button>
            </SettingRow>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-0">
            <SettingRow label={t('plan')} description="Plano Professional — Renovação em 15 abr 2025">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                Professional
              </span>
            </SettingRow>
            <SettingRow label={t('paymentMethod')} description="Mastercard terminando em 4321">
              <button type="button" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Atualizar <ChevronRight className="w-4 h-4" />
              </button>
            </SettingRow>
            <SettingRow label={t('invoices')} description="Histórico de faturas e recibos">
              <button type="button" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Ver faturas <ChevronRight className="w-4 h-4" />
              </button>
            </SettingRow>
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t('subtitle')}</p>
        </div>
        <AnimatePresence>
          {saved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-600 text-sm font-bold rounded-xl"
            >
              <Check className="w-4 h-4" />
              {t('saved')}
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              form={activeSection === 'restaurant' ? 'restaurant-form' : activeSection === 'profile' ? 'profile-form' : undefined}
              type={(activeSection === 'restaurant' || activeSection === 'profile') ? 'submit' : 'button'}
              disabled={activeSection === 'restaurant' ? isSubmittingRestaurant : activeSection === 'profile' ? isSubmittingProfile : false}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-50"
            >
              {(isSubmittingRestaurant || isSubmittingProfile || isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('saveChanges')}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0"
        >
          {sectionConfig.map(({ key, icon: Icon, color, bg }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap w-full text-left ${
                activeSection === key
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className={`w-8 h-8 rounded-lg ${activeSection === key ? bg : 'bg-slate-100 dark:bg-white/5'} ${activeSection === key ? color : 'text-slate-400'} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </span>
              {t(key as any)}
              {activeSection === key && (
                <ChevronRight className={`w-4 h-4 ml-auto ${color}`} />
              )}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
            {(() => {
              const cfg = sectionConfig.find(c => c.key === activeSection)!;
              const Icon = cfg.icon;
              return (
                <>
                  <span className={`w-10 h-10 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-base">{t(activeSection as any)}</h2>
                  </div>
                </>
              );
            })()}
          </div>
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
