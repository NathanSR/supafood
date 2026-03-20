'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'delete';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false
}: ConfirmDialogProps) {
  
  const getIcon = () => {
    switch (variant) {
      case 'danger':
      case 'delete':
        return <Trash2 className="w-6 h-6 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-6 h-6 text-primary" />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
      case 'delete':
        return 'destructive';
      case 'warning':
        return 'default'; // Or a yellow variant if exists
      case 'info':
      default:
        return 'default';
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'danger':
      case 'delete':
        return 'bg-destructive/10 dark:bg-destructive/20';
      case 'warning':
        return 'bg-yellow-500/10 dark:bg-yellow-500/20';
      case 'info':
      default:
        return 'bg-primary/10 dark:bg-primary/20';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="" // Title is handled inside for better UX
      maxWidth="max-w-md"
      className="p-0 border-none"
    >
      <div className="p-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={cn(
            "w-16 h-16 rounded-3xl flex items-center justify-center mb-6",
            getIconBg()
          )}
        >
          {getIcon()}
        </motion.div>
        
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant() as any}
            onClick={onConfirm}
            className={cn(
              "flex-1 rounded-2xl h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
              variant === 'delete' || variant === 'danger' ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>{confirmText}...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
