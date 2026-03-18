'use client';

import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { useTranslations } from 'next-intl';
import { 
  Phone, 
  Mail,
  Building2,
  MapPin,
  Calendar,
  Star,
  Globe,
  Clock,
  DollarSign,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RestaurantDetailsDrawerProps {
  restaurant: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (restaurant: any) => void;
  onDelete: (restaurant: any) => void;
  isActive?: boolean;
}

export function RestaurantDetailsDrawer({ restaurant, isOpen, onClose, onEdit, onDelete, isActive }: RestaurantDetailsDrawerProps) {
  const t = useTranslations('Restaurants');

  if (!restaurant) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} showClose={false}>
        {/* Header/Cover */}
        <div className="relative h-48 w-full bg-primary/5 dark:bg-primary/10">
          <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-card to-transparent" />
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] bg-card dark:bg-card shadow-2xl flex items-center justify-center text-4xl overflow-hidden border-4 border-card dark:border-card">
                <span>🏪</span>
              </div>
              {isActive && (
                <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center bg-green-500">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 pt-16 pb-8 space-y-8">
          {/* Main Info */}
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {restaurant.name}
            </h2>
            <div className="flex items-center gap-3">
              {restaurant.is_primary && (
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider bg-amber-500/10 text-amber-600 border-amber-500/20 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500" />
                  {t('primary')}
                </span>
              )}
              {isActive && (
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider bg-green-500/10 text-green-600 border-green-500/20">
                  {t('active')}
                </span>
              )}
              <span className="text-xs font-bold text-slate-400">ID: {restaurant.id.split('-')[0].toUpperCase()}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[24px] border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('currency')}</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <p className="text-lg font-black text-slate-900 dark:text-white">{restaurant.currency || 'BRL'}</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[24px] border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('timezone')}</p>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                  {restaurant.timezone?.split('/').pop()?.replace('_', ' ') || 'N/A'}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[24px] border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('language')}</p>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{restaurant.language || 'pt-BR'}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
               <Building2 className="w-4 h-4 text-primary" />
               {t('contactInfo')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t('email')}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{restaurant.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t('phone')}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{restaurant.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t('address')}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{restaurant.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
               <Calendar className="w-4 h-4 text-primary" />
               {t('details')}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">{t('createdAt')}</span>
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                  {restaurant.created_at ? new Date(restaurant.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{t('quickActions')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl font-bold bg-background dark:bg-white/5 border-slate-100 dark:border-white/5 text-foreground"
                onClick={() => onEdit(restaurant)}
              >
                <Edit2 className="w-4 h-4 mr-2 text-primary" />
                {t('edit')}
              </Button>
              {!restaurant.is_primary && (
                <Button 
                  variant="outline" 
                  className="h-14 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-100 dark:border-red-500/20"
                  onClick={() => onDelete(restaurant)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('delete')}
                </Button>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
            >
              {t('close')}
            </button>
          </div>
        </div>
    </Drawer>
  );
}
