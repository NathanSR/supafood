'use client';

import React from 'react';
import { 
  Utensils, 
  LayoutDashboard, 
  ClipboardList, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Users,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useSidebar } from '@/context/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  key: string; // translation key
};

type NavGroup = {
  groupKey: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    groupKey: 'groupOperations',
    items: [
      { name: 'Home', href: '/home', icon: LayoutDashboard, key: 'home' },
      { name: 'Orders', href: '/orders', icon: ClipboardList, key: 'orders' },
      { name: 'Tables', href: '/tables', icon: LayoutGrid, key: 'tables' },
    ],
  },
  {
    groupKey: 'groupManagement',
    items: [
      { name: 'Menu', href: '/menu', icon: BookOpen, key: 'menu' },
      { name: 'Staff', href: '/staff', icon: Users, key: 'staff' },
      { name: 'Analytics', href: '/analytics', icon: TrendingUp, key: 'analytics' },
    ],
  },
  {
    groupKey: 'groupSystem',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings, key: 'settings' },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const { isCollapsed, toggle } = useSidebar();

  const isMobile = className?.includes('w-full');

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '72px' },
    mobile: { width: '100%' }
  };

  return (
    <motion.aside 
      initial={false}
      animate={isMobile ? 'mobile' : (isCollapsed ? 'collapsed' : 'expanded')}
      variants={sidebarVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex-shrink-0 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-surface-dark flex flex-col h-full z-20 shadow-xl overflow-hidden",
        className
      )}
    >
      {/* Toggle Button - Hide on Mobile */}
      {!isMobile && (
        <button 
          onClick={toggle}
          className="absolute -right-3 top-20 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-background-dark shadow-md z-30 hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}

      {/* Logo */}
      <div className={cn("p-5 flex items-center gap-3 border-b border-slate-100 dark:border-white/5", isCollapsed && !isMobile && "px-4 justify-center")}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <Utensils className="w-6 h-6 stroke-[2.5]" />
        </div>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-black italic tracking-tighter whitespace-nowrap overflow-hidden"
            >
              SUPAFOOD
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group) => {
          const normalizedPathname = pathname === '' ? '/' : pathname;

          return (
            <div key={group.groupKey} className="mb-4">
              {/* Group Label */}
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-2"
                  >
                    {t(group.groupKey as any)}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Group Divider when collapsed */}
              {isCollapsed && !isMobile && (
                <div className="w-full h-px bg-slate-100 dark:bg-white/5 mb-2" />
              )}

              {/* Items */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = normalizedPathname === item.href || 
                    (normalizedPathname.startsWith(item.href) && item.href !== '/home');
                  const isHomeActive = item.href === '/home' && normalizedPathname === '/home';
                  const active = item.href === '/home' ? isHomeActive : isActive;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      title={isCollapsed && !isMobile ? t(item.key as any) : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group font-semibold text-sm whitespace-nowrap",
                        active
                          ? "sidebar-item-active"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100",
                        isCollapsed && !isMobile && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn("w-[20px] h-[20px] flex-shrink-0 transition-colors", active ? "text-primary" : "group-hover:text-slate-700 dark:group-hover:text-slate-200")} />
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            {t(item.key as any)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <AnimatePresence>
        {(!isCollapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 border-t border-slate-100 dark:border-white/5"
          >
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-600">
              SUPAFOOD v1.0 © 2025
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
