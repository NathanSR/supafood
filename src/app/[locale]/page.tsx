"use client";

import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BarChart3, 
  MenuSquare, 
  LayoutGrid, 
  Building2, 
  ArrowRight,
  Globe,
  Sun,
  Moon,
  Play,
  Twitter,
  Instagram,
  Linkedin,
  MapPin
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

export default function RootLocalePage() {
  const t = useTranslations('Index');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [trackId, setTrackId] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackId.trim()) {
      router.push(`/track?id=${trackId}`);
    }
  };

  const toggleLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-hidden font-sans">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
        <nav className="w-full max-w-7xl flex items-center justify-between px-6 py-4 glass rounded-2xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-primary">Supafood</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Solutions', 'Resources', 'Pricing', 'About'].map((item) => (
              <button key={item} className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors cursor-pointer">
                {t(`nav${item}`)}
              </button>
            ))}
          </div>

          <Link href="/login">
            <Button size="lg" className="rounded-xl font-bold px-6 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              {t('navAccess')}
            </Button>
          </Link>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[140px] -z-10" />
        <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-primary uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t('heroBadge')}
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] text-balance">
            {t('heroTitle')} <span className="text-primary italic font-serif lowercase tracking-normal">{t('heroTitleHighlight')}</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-16 px-10 rounded-2xl text-base font-bold flex items-center gap-4 shadow-2xl shadow-primary/30 group">
              {t('heroCTA')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <form onSubmit={handleTrack} className="relative group w-full sm:w-auto">
              <input
                type="text"
                placeholder={t('trackOrderPlaceholder')}
                className="h-16 w-full sm:w-[320px] pl-6 pr-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-white/5 transition-all">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Partners Logos */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="w-full max-w-7xl mt-32 border-t border-white/5 pt-16 flex flex-col items-center gap-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             {['BISTRO_', 'GRILL.CO', 'URBAN', 'SUSHI_X', 'VINO.'].map(logo => (
               <span key={logo} className="text-xl font-bold tracking-[0.2em]">{logo}</span>
             ))}
          </div>
          <div className="text-center">
            <div className="text-4xl font-black tracking-tighter text-primary">{t('partnersTitle')}</div>
            <div className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">{t('partnersSubtitle')}</div>
          </div>
        </motion.div>
      </section>

      {/* --- BENTO GRID SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 space-y-16">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{t('featuresTitle')}</h2>
          <div className="w-24 h-1.5 bg-primary rounded-full" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Feature: Analytics */}
          <motion.div variants={itemVariants} className="md:col-span-8 group relative rounded-[2rem] p-10 border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col justify-between min-h-[480px]">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
            <div className="relative z-10 w-fit p-4 rounded-2xl bg-primary/10 mb-8">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <div className="relative z-10 space-y-4 max-w-md">
              <h3 className="text-3xl font-black tracking-tight leading-none">{t('featureAnalytics')}</h3>
              <p className="text-muted-foreground/80 font-medium leading-relaxed">{t('featureAnalyticsDesc')}</p>
            </div>
            {/* Visual: Bar Chart */}
            <div className="absolute bottom-10 right-10 flex items-end gap-2 h-32 md:h-48">
              {[0.4, 0.6, 1, 0.5, 0.3].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  className={cn(
                    "w-10 md:w-16 rounded-2xl", 
                    h === 1 ? "bg-primary shadow-2xl shadow-primary/40" : "bg-primary/20"
                  )}
                />
              ))}
            </div>
          </motion.div>

          {/* Feature: Digital Menu */}
          <motion.div variants={itemVariants} className="md:col-span-4 rounded-[2rem] p-10 border border-white/5 bg-white/[0.02] flex flex-col justify-between min-h-[480px] overflow-hidden">
            <div className="w-fit p-4 rounded-2xl bg-sky-500/10 mb-8">
              <MenuSquare className="w-8 h-8 text-sky-500" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tight leading-none">{t('featureMenu')}</h3>
              <p className="text-muted-foreground/80 font-medium leading-relaxed">{t('featureMenuDesc')}</p>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="w-32 h-32 rounded-3xl border-4 border-dashed border-white/10 flex items-center justify-center p-6 bg-white/5">
                <LayoutGrid className="w-full h-full text-white/20" />
              </div>
            </div>
          </motion.div>

          {/* Feature: Tables */}
          <motion.div variants={itemVariants} className="md:col-span-4 rounded-[2rem] p-10 border border-white/5 bg-white/[0.02] flex flex-col justify-between min-h-[480px]">
            <div className="w-fit p-4 rounded-2xl bg-orange-500/10 mb-8">
              <LayoutGrid className="w-8 h-8 text-orange-500" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tight leading-none">{t('featureTables')}</h3>
              <p className="text-muted-foreground/80 font-medium leading-relaxed">{t('featureTablesDesc')}</p>
            </div>
            <div className="flex flex-col gap-3 mt-8">
               <div className="px-4 py-2 rounded-full border border-green-500/50 bg-green-500/10 flex items-center gap-2 w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black text-green-500 uppercase">{t('tableFree', { num: '04' })}</span>
               </div>
               <div className="px-4 py-2 rounded-full border border-primary/50 bg-primary/10 flex items-center gap-2 w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-black text-primary uppercase">{t('tableOccupied', { num: '12' })}</span>
               </div>
            </div>
          </motion.div>

          {/* Feature: Multi-Unit */}
          <motion.div variants={itemVariants} className="md:col-span-8 group relative rounded-[2rem] p-10 border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col justify-between min-h-[480px]">
            <div className="relative z-10 w-fit p-4 rounded-2xl bg-purple-500/10 mb-8">
              <Building2 className="w-8 h-8 text-purple-500" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-end justify-between w-full">
              <div className="space-y-4 max-w-sm">
                <h3 className="text-3xl font-black tracking-tight leading-none">{t('featureMultiUnit')}</h3>
                <p className="text-muted-foreground/80 font-medium leading-relaxed">{t('featureMultiUnitDesc')}</p>
                <div className="flex gap-1.5 pt-4">
                  {[1, 2, 3].map(i => <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === 1 ? "bg-primary w-4" : "bg-white/10")} />)}
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-xs space-y-2">
                {[
                  { city: 'São Paulo, BR', active: true },
                  { city: 'Lisboa, PT', active: false },
                  { city: 'Nova York, US', active: false }
                ].map((loc, i) => (
                  <div key={i} className={cn("p-4 rounded-xl border flex items-center justify-between transition-all", loc.active ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 opacity-50")}>
                    <div className="flex items-center gap-3">
                      <MapPin className={cn("w-4 h-4", loc.active ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-xs font-bold">{loc.city}</span>
                    </div>
                    {loc.active && <span className="text-[8px] font-black text-primary">{t('locationActive')}</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 mb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] p-12 md:p-24 border border-white/5 bg-white/[0.02] overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-0" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{t('ctaTitle')}</h2>
              <p className="text-lg text-muted-foreground max-w-md font-medium leading-relaxed">{t('ctaSubtitle')}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="h-14 px-8 rounded-2xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                  {t('ctaStart')}
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-bold border-white/10 hover:bg-white/5">
                  {t('ctaDemo')}
                </Button>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <motion.div 
                whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
                className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm"
              >
                <div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden relative">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center pl-1 shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform cursor-pointer">
                        <Play className="w-6 h-6 text-primary-foreground fill-current" />
                      </div>
                   </div>
                   {/* Dummy UI Elements for decoration */}
                   <div className="absolute top-4 left-4 flex gap-1.5">
                      {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/10" />)}
                   </div>
                   <div className="absolute top-1/2 left-10 right-10 flex flex-col gap-4 opacity-20 translate-y-4">
                      <div className="h-4 w-1/2 bg-white/40 rounded-full" />
                      <div className="h-4 w-3/4 bg-white/20 rounded-full" />
                      <div className="h-4 w-2/3 bg-white/30 rounded-full" />
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/5 pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-4 space-y-8">
            <span className="text-2xl font-black tracking-tighter text-primary">Supafood</span>
            <p className="text-sm font-medium text-muted-foreground/70 leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="p-3 rounded-xl border border-white/5 hover:bg-white/5 hover:text-primary transition-all">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">{t('footerPlatform')}</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground/60">
              {['Terms', 'Privacy', 'API'].map(item => (
                <li key={item} className="hover:text-foreground transition-colors cursor-pointer">{t(`footerPlatform${item}`)}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">{t('footerSupport')}</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground/60">
              {['Help', 'Docs', 'Community'].map(item => (
                <li key={item} className="hover:text-foreground transition-colors cursor-pointer">{t(`footerSupport${item}`)}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-8 flex flex-col items-end">
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon-lg" className="rounded-xl border-white/5 hover:bg-white/5 h-12 w-12">
                    {mounted && (theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-[1.5rem] p-2 border-white/10 glass">
                  <DropdownMenuItem className="rounded-xl font-bold gap-3" onClick={() => setTheme('light')}>
                    <Sun className="w-4 h-4" /> {t('light')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl font-bold gap-3" onClick={() => setTheme('dark')}>
                    <Moon className="w-4 h-4" /> {t('dark')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl font-bold gap-3" onClick={() => setTheme('system')}>
                    <Globe className="w-4 h-4" /> {t('system')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-white/5 hover:bg-white/5 gap-3">
                    <Globe className="w-5 h-5" />
                    {locale.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-[1.5rem] p-2 border-white/10 glass min-w-[120px]">
                  <DropdownMenuItem className="rounded-xl font-bold h-12" onClick={() => toggleLanguage('pt-BR')}>
                    Português
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl font-bold h-12" onClick={() => toggleLanguage('en')}>
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-muted-foreground/30">
                {t('footerRights', { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
