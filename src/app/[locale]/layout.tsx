import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from 'sonner';

const inter = Inter({
  variable: '--font-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Supafood - Admin Dashboard',
  description: 'Restaurant Admin Dashboard for Supafood',
};

import { ThemeProvider } from '@/components/providers/ThemeProvider';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster
              richColors
              closeButton
              position="bottom-right"
              toastOptions={{
                style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
                className: 'my-toast-class',
              }}
            />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
