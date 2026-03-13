'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
  EyeOff
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type Section = 'restaurant' | 'notifications' | 'appearance' | 'security' | 'billing';

const sectionConfig: { key: Section; icon: React.ElementType; color: string; bg: string }[] = [
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

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const [activeSection, setActiveSection] = useState<Section>('restaurant');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Notification states
  const [emailNotif, setEmailNotif] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [lowStock, setLowStock] = useState(false);
  const [dailyReport, setDailyReport] = useState(true);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Restaurant form
  const [restaurantName, setRestaurantName] = useState('SUPAFOOD Restaurant');
  const [restaurantEmail, setRestaurantEmail] = useState('contato@supafood.com');
  const [restaurantPhone, setRestaurantPhone] = useState('(11) 3456-7890');
  const [restaurantAddress, setRestaurantAddress] = useState('Rua das Flores, 123 - São Paulo, SP');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'restaurant':
        return (
          <div className="space-y-0">
            <SettingRow label={t('restaurantName')}>
              <input
                value={restaurantName}
                onChange={e => setRestaurantName(e.target.value)}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </SettingRow>
            <SettingRow label={t('restaurantEmail')}>
              <input
                value={restaurantEmail}
                onChange={e => setRestaurantEmail(e.target.value)}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </SettingRow>
            <SettingRow label={t('restaurantPhone')}>
              <input
                value={restaurantPhone}
                onChange={e => setRestaurantPhone(e.target.value)}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </SettingRow>
            <SettingRow label={t('restaurantAddress')}>
              <input
                value={restaurantAddress}
                onChange={e => setRestaurantAddress(e.target.value)}
                className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </SettingRow>
            <SettingRow label={t('currency')}>
              <select className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all">
                <option>BRL — Real Brasileiro</option>
                <option>USD — US Dollar</option>
                <option>EUR — Euro</option>
              </select>
            </SettingRow>
            <SettingRow label={t('timezone')}>
              <select className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all">
                <option>America/Sao_Paulo (GMT-3)</option>
                <option>America/New_York (GMT-5)</option>
                <option>Europe/London (GMT+0)</option>
              </select>
            </SettingRow>
            <SettingRow label={t('language')}>
              <select className="w-64 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all">
                <option>Português (Brasil)</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </SettingRow>
          </div>
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
            <SettingRow label={t('changePassword')} description="Atualize sua senha regularmente">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-48 pl-3 pr-10 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-105 transition-transform">
                  Alterar
                </button>
              </div>
            </SettingRow>
            <SettingRow label={t('twoFactor')} description="Adicione uma camada extra de segurança">
              <Toggle enabled={twoFactor} onChange={setTwoFactor} />
            </SettingRow>
            <SettingRow label={t('sessions')} description="2 sessões ativas no momento">
              <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
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
              <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Atualizar <ChevronRight className="w-4 h-4" />
              </button>
            </SettingRow>
            <SettingRow label={t('invoices')} description="Histórico de faturas e recibos">
              <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
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
              onClick={handleSave}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
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
