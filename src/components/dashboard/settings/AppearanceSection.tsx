'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { SettingRow } from './Shared';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

interface AppearanceSectionProps {
  currentLocale: string;
}

export function AppearanceSection({ currentLocale }: AppearanceSectionProps) {
  const t = useTranslations('Settings');
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const changeLocale = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  const themes = [
    { value: 'light', icon: Sun, label: t('light') },
    { value: 'dark', icon: Moon, label: t('dark') },
    { value: 'system', icon: Monitor, label: t('system') },
  ] as const;

  const languages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="space-y-6">
      {/* Tema Section */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <SettingRow label={t('appearance')} description={t('theme')}>
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
            {themes.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-bold ${
                  theme === opt.value
                    ? 'bg-white dark:bg-[#FF5F15] text-[#FF5F15] dark:text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <opt.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            ))}
          </div>
        </SettingRow>
      </div>

      {/* Idioma Section */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <SettingRow label={t('language')} description="Escolha o idioma preferido para a plataforma">
          <div className="flex flex-col sm:flex-row gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLocale(lang.code)}
                type="button"
                className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border-2 transition-all min-w-[160px] ${
                  currentLocale === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div className="text-left">
                    <p className={`text-sm font-black ${currentLocale === lang.code ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                      {lang.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang.code}</p>
                  </div>
                </div>
                {currentLocale === lang.code && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </SettingRow>
      </div>
    </div>
  );
}
