"use client";

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  QrCode,
  Package,
  Soup,
  CheckCircle2,
  Utensils,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface TrackClientProps {
  initialOrders: any[];
  orderId?: string;
  tableId?: string;
  locale: string;
}

export default function TrackClient({ initialOrders, orderId, tableId, locale }: TrackClientProps) {
  const t = useTranslations('Track');
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [trackInput, setTrackInput] = useState(orderId || '');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const supabase = createClient();

  // 1. Realtime setup
  useEffect(() => {
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: 'UPDATE', table: 'orders', schema: 'public' },
        (payload) => {
          const updatedOrder = payload.new;
          setOrders((prev) => 
            prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      router.push(`/${locale}/track?id=${trackInput}`);
    }
  };

  const statusToSteps = (status: string) => {
    const steps = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return { steps, currentIndex };
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'pending': return Package;
      case 'preparing': return Soup;
      case 'ready': return Bell; // Wait, Bell icon for 'ready'? Or CheckCircle
      case 'delivered': return Utensils;
      default: return CheckCircle2;
    }
  };

  const Bell = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 0 12 0c0-7-3-9-3-9s-3 2-3 9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 19h16"/></svg>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // --- SUB-COMPONENTS ---

  // Order List Item (for Table view or single order)
  const OrderCard = ({ order }: { order: any }) => {
    const { steps, currentIndex } = statusToSteps(order.status);
    const orderNumber = order.order_number?.toString().padStart(4, '0') || '0000';

    return (
      <motion.div 
        variants={itemVariants}
        className="w-full glass rounded-[2rem] p-8 space-y-8 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black">{t('orderNumber', { number: orderNumber })}</h2>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(order.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            {currentIndex === 3 ? <CheckCircle2 className="w-8 h-8" /> : (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                <RefreshCw className="w-8 h-8" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Stepper */}
        <div className="relative flex items-center justify-between px-2 pt-4">
          {/* Progress Line */}
          <div className="absolute top-[calc(2.5rem-2px)] left-8 right-8 h-1 bg-white/5 -z-10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = getStepIcon(step);
            const isActive = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step} className="flex flex-col items-center gap-3 relative">
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.2)'
                  }}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-4 border-background transition-colors",
                    isCurrent && "shadow-[0_0_20px_rgba(255,95,20,0.4)]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isActive ? "text-foreground" : "text-muted-foreground/30"
                )}>
                  {t(`steps.${step}`)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Items */}
        <div className="space-y-4 pt-8 border-t border-white/5">
          <h3 className="text-xs font-black tracking-widest uppercase opacity-40">{t('items')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {order.order_items?.map((oi: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="font-bold">{oi.menu_items?.name}</span>
                <span className="text-primary font-black">x{oi.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end pt-4">
          <div className="text-[10px] font-black tracking-[0.2em] opacity-30 uppercase">
            {order.table_id ? t('table', { number: order.tables?.number }) : 'SUPAFOOD TRACK'}
          </div>
          <div className="text-2xl font-black">
            {new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(order.total_amount || 0)}
          </div>
        </div>
      </motion.div>
    );
  };

  // --- RENDERING ---

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-hidden font-sans pb-20">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href={`/${locale}`}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-primary font-black text-2xl"
          >
            Supafood
          </motion.div>
        </Link>
        <Link href={`/${locale}`}>
          <Button variant="outline" size="lg" className="rounded-2xl border-white/10 hover:bg-white/5 font-bold gap-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t('back')}</span>
          </Button>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
        
        {/* Search / QR Header (if no active orders or to track another) */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {orders.length === 0 ? (
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter">{t('title')}</h1>
              <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">{t('subtitle')}</p>
            </div>
          ) : (
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t('activeOrders')}
             </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <form onSubmit={handleSearch} className="relative group w-full sm:w-[400px]">
              <input
                type="text"
                placeholder={t('placeholder')}
                className="h-16 w-full pl-6 pr-14 rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-primary hover:bg-white/5 transition-all">
                <Search className="w-6 h-6" />
              </button>
            </form>
            
            <Button size="lg" className="h-16 w-full sm:w-auto px-8 rounded-[1.5rem] font-black text-xs uppercase tracking-widest gap-4">
              <QrCode className="w-6 h-6" />
              {t('scanQR')}
            </Button>
          </div>
        </motion.section>

        {/* Results */}
        <AnimatePresence mode="wait">
          {orders.length > 0 ? (
            <motion.section 
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </motion.section>
          ) : (
            <motion.section 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-20 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                <Search className="w-12 h-12 opacity-20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">{t('noOrder')}</h3>
                <p className="text-muted-foreground font-medium">{t('noOrderDesc')}</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 w-full p-8 flex justify-center pointer-events-none">
        <div className="text-[10px] font-black tracking-[0.5em] text-primary/20 uppercase">
          Supafood Magic Service
        </div>
      </footer>
    </div>
  );
}
