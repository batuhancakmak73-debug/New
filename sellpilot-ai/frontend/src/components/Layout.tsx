import { useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3, Calendar, LayoutDashboard, List, LogOut, Menu, Package,
  Plus, Rocket, Store, Users, Wand2, X, Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/wizard', label: 'Wizard', icon: Wand2 },
  { to: '/listings', label: 'Listings', icon: List },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/wizard': 'Listing Wizard',
  '/listings': 'Listings',
  '/calendar': 'Calendar',
  '/leads': 'Leads CRM',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <Link to="/dashboard" className="flex items-center gap-2 px-5 py-5" onClick={onNavigate}>
        <div className="rounded-lg bg-sp-primary p-1.5">
          <Rocket size={18} className="text-white" />
        </div>
        <span className="font-heading text-lg font-bold lg:inline md:hidden">SellPilot AI</span>
      </Link>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sp-primary/15 text-sp-primary-light'
                  : 'text-sp-text-secondary hover:bg-sp-hover hover:text-sp-text'
              )
            }
          >
            <Icon size={17} className="shrink-0" />
            <span className="lg:inline md:hidden">{label}</span>
          </NavLink>
        ))}

        <div className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-widest text-sp-text-muted lg:block md:hidden">
          Platform
        </div>
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sp-primary/15 text-sp-primary-light'
                : 'text-sp-text-secondary hover:bg-sp-hover hover:text-sp-text'
            )
          }
        >
          <Store size={17} className="shrink-0" />
          <span className="lg:inline md:hidden">Marketplaces</span>
        </NavLink>
      </nav>

      <div className="space-y-3 p-4">
        <Link to="/wizard" onClick={onNavigate}>
          <Button className="w-full">
            <Plus size={16} />
            <span className="lg:inline md:hidden">New Listing</span>
          </Button>
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-2 py-1">
          <Avatar name={user?.name || '?'} />
          <div className="min-w-0 lg:block md:hidden">
            <div className="truncate text-sm font-medium text-sp-text">{user?.name}</div>
            <div className="truncate text-xs text-sp-text-muted">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = PAGE_TITLES[location.pathname] || (location.pathname.startsWith('/wizard') ? 'Listing Wizard' : 'SellPilot');

  return (
    <div className="flex min-h-screen bg-sp-base">
      {/* Desktop / tablet sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden border-r border-sp-active/40 bg-sp-sidebar md:block md:w-[72px] lg:w-[240px]">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className="h-full w-[260px] border-r border-sp-active/40 bg-sp-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)} className="text-sp-text-secondary">
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col md:pl-[72px] lg:pl-[240px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-sp-active/40 bg-sp-base/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="text-sp-text-secondary md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="font-heading text-lg font-semibold">{title}</h1>
          </div>
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-sp-hover">
                <Avatar name={user?.name || '?'} className="h-8 w-8" />
              </button>
            }
            items={[
              { label: <span className="flex items-center gap-2"><SettingsIcon size={14} /> Settings</span>, onClick: () => (window.location.href = '/settings') },
              { label: <span className="flex items-center gap-2"><LogOut size={14} /> Log out</span>, onClick: () => logout(), danger: true },
            ]}
          />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
