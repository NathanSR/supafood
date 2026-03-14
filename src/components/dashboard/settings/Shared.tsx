'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ enabled, onChange, disabled }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      type="button"
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out outline-none focus:ring-4 focus:ring-primary/20 ${enabled
        ? 'bg-[#FF5F15]'
        : 'bg-slate-200 dark:bg-white/10'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}`}
    >
      <motion.span
        initial={false}
        animate={{
          x: enabled ? 4 : -20,
          scale: enabled ? 1 : 0.9
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      />
      {/* Visual indicator for interactive feel */}
      <span className={`absolute inset-0 rounded-full transition-opacity duration-300 ${enabled ? 'opacity-20 bg-white' : 'opacity-0'}`} />
    </button>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
}

export function SettingRow({ label, description, children, error }: SettingRowProps) {
  return (
    <div className="group flex flex-col py-5 border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
            {label}
          </p>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center">
          {children}
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-wider text-right"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
