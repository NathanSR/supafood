import React from 'react';
import { Link } from '@/i18n/routing';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('Auth');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Navigation and Logo */}
      <div className="fixed top-0 left-0 right-0 p-6 md:p-8 flex items-center justify-between z-50 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="group flex items-center gap-3 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden sm:inline">{t('backToHome')}</span>
        </Link>

        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground uppercase">Supafood</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
