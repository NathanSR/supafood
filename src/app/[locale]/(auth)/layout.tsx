import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-white/5">
        <div className="flex justify-center mb-8">
          <span className="text-3xl font-black italic tracking-tighter text-primary">SUPAFOOD</span>
        </div>
        {children}
      </div>
    </div>
  );
}
