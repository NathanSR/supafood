import React from 'react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Navigation'); // Or an Auth translation namespace if you prefer. Using a basic setup for now.

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none" placeholder="admin@supafood.io" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
          Sign In
        </button>
      </form>
    </div>
  );
}
