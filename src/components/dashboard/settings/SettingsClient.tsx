'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Store, Bell, Palette, CreditCard, Check, ChevronRight, Loader2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Components
import { ProfileSection } from '@/components/dashboard/settings/ProfileSection';
import { RestaurantSection } from '@/components/dashboard/settings/RestaurantSection';
import { NotificationsSection } from '@/components/dashboard/settings/NotificationsSection';
import { AppearanceSection } from '@/components/dashboard/settings/AppearanceSection';
import { BillingSection } from '@/components/dashboard/settings/BillingSection';
import { type UserProfileInput, type RestaurantSettingsInput, type PasswordInput } from '@/lib/validations/profile';
import { updateProfile, updatePassword } from '@/app/actions/auth';
import { updateRestaurantSettings } from '@/app/actions/restaurant';

type Section = 'profile' | 'restaurant' | 'notifications' | 'appearance' | 'billing';

const sectionConfig: { key: Section; icon: React.ElementType; color: string; bg: string }[] = [
  { key: 'profile', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { key: 'restaurant', icon: Store, color: 'text-primary', bg: 'bg-primary/10' },
  { key: 'notifications', icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'appearance', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { key: 'billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

interface SettingsClientProps {
  initialProfile: { fullName: string; avatarUrl: string };
  initialRestaurant: RestaurantSettingsInput;
  locale: string;
}

export function SettingsClient({ initialProfile, initialRestaurant, locale }: SettingsClientProps) {
  const t = useTranslations('Settings');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isValidSection = (value: string | null): value is Section =>
    !!value && ['profile', 'restaurant', 'notifications', 'appearance', 'billing'].includes(value);

  const urlSection = searchParams.get('section');
  const activeSection: Section = isValidSection(urlSection) ? urlSection : 'profile';
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSectionChange = (section: Section) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('section', section);

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(url, { scroll: false });
  };

  const handleUpdateProfile = async (data: UserProfileInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0]);
      }
      const result = await updateProfile(formData);
      if (result?.success) showSaved();
    });
  };

  const handleUpdatePassword = async (data: PasswordInput) => {
    startTransition(async () => {
      const result = await updatePassword(data.password);
      if (result?.success) showSaved();
    });
  };

  const handleUpdateRestaurant = async (data: RestaurantSettingsInput) => {
    startTransition(async () => {
      const result = await updateRestaurantSettings(data);
      if (result?.success) showSaved();
    });
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSection 
            initialData={initialProfile} 
            onUpdateProfile={handleUpdateProfile} 
            onUpdatePassword={handleUpdatePassword} 
          />
        );
      case 'restaurant':
        return (
          <RestaurantSection 
            initialData={initialRestaurant} 
            onUpdate={handleUpdateRestaurant} 
          />
        );
      case 'notifications':
        return <NotificationsSection />;
      case 'appearance':
        return <AppearanceSection currentLocale={locale} />;
      case 'billing':
        return <BillingSection />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">{t('title')}</h1>
          <p className="text-slate-400 text-sm mt-1">{t('subtitle')}</p>
        </div>
        
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 text-sm font-black rounded-2xl border border-green-500/20 shadow-lg shadow-green-500/10"
            >
              <Check className="w-5 h-5" />
              {t('saved')}
            </motion.div>
          ) : (
            <motion.button
              key="save"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              form={activeSection === 'restaurant' ? 'restaurant-form' : activeSection === 'profile' ? 'profile-form' : undefined}
              type={(activeSection === 'restaurant' || activeSection === 'profile') ? 'submit' : 'button'}
              className={`px-8 py-3 bg-[#FF5F15] text-white text-sm font-black rounded-2xl shadow-xl shadow-[#FF5F15]/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 ${(!['restaurant', 'profile'].includes(activeSection)) && 'hidden'}`}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('saveChanges').toUpperCase()}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Navigation Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 lg:sticky lg:top-24"
        >
          {sectionConfig.map(({ key, icon: Icon, color, bg }) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap lg:w-full text-left group box-border border-2 ${
                activeSection === key
                  ? `bg-white/5 border-${color.split('-')[1]}-500/30 ${color}`
                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`w-10 h-10 rounded-xl ${activeSection === key ? bg : 'bg-white/5 group-hover:bg-white/10'} ${activeSection === key ? color : 'text-slate-400'} flex items-center justify-center flex-shrink-0 transition-all`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="flex-1">{t(key as string)}</span>
              {activeSection === key && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className={`w-5 h-5 ${color}`} />
                </motion.div>
              )}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[120px] rounded-full opacity-10 bg-current ${sectionConfig.find(s => s.key === activeSection)?.color}`} />
            
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
              {(() => {
                const cfg = sectionConfig.find(c => c.key === activeSection)!;
                const Icon = cfg.icon;
                return (
                  <>
                    <div className={`w-12 h-12 rounded-2xl ${cfg.bg} ${cfg.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{t(activeSection as string)}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configurações de {activeSection}</p>
                    </div>
                  </>
                );
              })()}
            </div>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
