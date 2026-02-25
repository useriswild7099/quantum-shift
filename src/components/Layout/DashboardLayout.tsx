'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Tent, 
  Users, 
  Package, 
  Heart, 
  Bell, 
  TriangleAlert, 
  ShieldCheck, 
  MessageSquarePlus,
  LayoutDashboard,
  Megaphone,
  BookOpen
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const publicNavigation = [
  { name: 'Relief Hub', href: '/', icon: Home },
  { name: 'Donations', href: '/donations', icon: Heart },
  { name: 'Find Camps', href: '/camps', icon: Tent },
  { name: 'Survival Protocols', href: '/protocols', icon: BookOpen },
  { name: 'Report Need', href: '/report', icon: MessageSquarePlus },
  { name: 'Supplies', href: '/resources', icon: Package },
];

const volunteerNavigation = [
  { name: 'Deploy Dashboard', href: '/volunteers', icon: Users },
  { name: 'Active Route', href: '/volunteers/route', icon: Package }, // Route to be created
];

const authorityNavigation = [
  { name: 'Fleet Command', href: '/government', icon: LayoutDashboard },
  { name: 'Task Allocation', href: '/government/tasks', icon: Users },
  { name: 'Incident Verification', href: '/government#reports', icon: Megaphone },
  { name: 'National Inventory', href: '/inventory', icon: Package },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { alerts, userRole, setRole, isHydrated } = useAppStore();
  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const isAuthorityView = userRole === 'government';
  const isVolunteerView = userRole === 'volunteer';

  // Protect routes / enforce role selection
  useEffect(() => {
    if (isHydrated && !userRole && pathname !== '/login') {
      router.push('/login');
    }
  }, [userRole, pathname, router, isHydrated]);

  if (!userRole) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <Heart className="w-6 h-6 text-indigo-500 mr-2" />
          <h1 className="text-xl font-bold tracking-tight text-white italic">Quantum Shift</h1>
        </div>
        
        <div className="flex-1 py-6 px-3 flex flex-col">
          
          {userRole === 'public' && (
            <div className="mb-8">
              <h3 className="px-3 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Public Services</h3>
              <nav className="space-y-1">
                {publicNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' 
                          : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white border border-transparent'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {userRole === 'volunteer' && (
            <div className="mb-8">
              <h3 className="px-3 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Operations</h3>
              <nav className="space-y-1">
                {volunteerNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                          : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white border border-transparent'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-400' : 'text-neutral-500'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {userRole === 'government' && (
            <div>
              <h3 className="px-3 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Administration</h3>
              <nav className="space-y-1">
                {authorityNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                          : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white border border-transparent'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-indigo-400' : 'text-neutral-500'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* User Profile Hook */}
          <div className="mt-auto px-3">
             <div className="p-4 bg-neutral-800/50 rounded-2xl border border-neutral-700/50">
                <div className="flex items-center space-x-3 mb-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                     userRole === 'government' ? 'bg-indigo-600' :
                     userRole === 'volunteer' ? 'bg-blue-600' : 'bg-emerald-600'
                   }`}>
                     {userRole === 'government' ? 'GOV' : userRole === 'volunteer' ? 'VOL' : 'PUB'}
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate text-ellipsis uppercase">{userRole} ACCESS</p>
                      <p className="text-[10px] text-neutral-500 truncate">Connected</p>
                   </div>
                </div>
                <button 
                  onClick={() => { setRole(null); router.push('/login'); }}
                  className="w-full py-1.5 bg-neutral-900 text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-neutral-700 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
                >
                   Switch Role
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between px-6 z-10 w-full overflow-hidden">
          
          <div className="flex items-center space-x-2 md:space-x-4 pr-4">
             {/* CRITICAL DISCLAIMER */}
            <div className={`flex items-center space-x-2 ${isAuthorityView ? 'bg-indigo-500/10 border-indigo-500/20' : isVolunteerView ? 'bg-blue-500/10 border-blue-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} border px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap overflow-hidden text-ellipsis min-w-0 max-w-full`}>
              <TriangleAlert className={`w-3.5 h-3.5 flex-shrink-0 ${isAuthorityView ? 'text-indigo-500' : isVolunteerView ? 'text-blue-500' : 'text-emerald-500'}`} />
              <span className={`text-[10px] font-black ${isAuthorityView ? 'text-indigo-500' : isVolunteerView ? 'text-blue-500' : 'text-emerald-500'} tracking-[0.1em] uppercase truncate`}>
                PROTOTYPE/DEMO ONLY: Not connected to real emergency services.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            {isAuthorityView && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter italic">Verified Administrator</span>
              </div>
            )}
            
            <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-neutral-900 animate-pulse"></span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
