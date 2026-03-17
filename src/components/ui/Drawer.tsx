'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Side = 'top' | 'bottom' | 'left' | 'right';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: Side;
  className?: string;
  showClose?: boolean;
}

const variants = {
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
    className: 'top-0 left-0 right-0 w-full h-fit max-h-[90vh] rounded-b-[40px]',
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    className: 'bottom-0 left-0 right-0 w-full h-fit max-h-[90vh] rounded-t-[40px]',
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    className: 'top-0 left-0 bottom-0 h-full w-full sm:max-w-md rounded-r-[40px]',
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    className: 'top-0 right-0 bottom-0 h-full w-full sm:max-w-md rounded-l-[40px]',
  },
};

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className = '',
  showClose = true,
}: DrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const variant = variants[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed bg-card dark:bg-card text-foreground shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] z-10 flex flex-col border border-white/20 dark:border-white/10 overflow-hidden',
              variant.className,
              className
            )}
          >
            {(title || showClose) && (
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
                {title ? <h2 className="text-xl font-bold">{title}</h2> : <div />}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <div className="overflow-y-auto flex-1 no-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
