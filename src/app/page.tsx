'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { StrategicGlobe } from '@/components/Globe/StrategicGlobe';
import { ReliefMap } from '@/components/Map/ReliefMap';
import { 
  ShieldAlert, 
  MapPin, 
  Heart, 
  Users, 
  MessageSquarePlus, 
  Navigation,
  Activity,
  Zap,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { DonationTracker } from '@/components/UI/DonationTracker';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function CinematicHome() {
  const { camps, alerts } = useAppStore();
  const [viewMode, setViewMode] = useState<'globe' | 'map'>('globe');
  
  const criticalAlerts = alerts.filter(a => a.type === 'Critical');

  return (
    <DashboardLayout>
      <div className="relative min-h-[calc(100vh-8rem)] space-y-10">
        {/* Background Cinematic scanlines handled by layout/globals */}
        
        {/* Hero Section with Live 3D/2D Toggle */}
        <section className="relative z-10 grid grid-cols-1 xl:grid-cols-4 gap-8 xl:h-[calc(100vh-12rem)]">
          
          {/* Cinematic Map Container */}
          <div className="xl:col-span-3 h-[500px] xl:h-full relative rounded-3xl overflow-hidden glass-panel group shadow-xl">
            
            <AnimatePresence mode="wait">
              {viewMode === 'globe' ? (
                <motion.div 
                  key="globe"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full h-full"
                >
                  <StrategicGlobe onEngage={() => setViewMode('map')} />
                  
                  {/* Globe HUD Overlay */}
                  <div className="absolute top-8 right-8 space-y-4 pointer-events-none">
                    <HUDIndicator label="SATELLITE SYNC" value="ENCRYPTED" />
                    <HUDIndicator label="ORBITAL ALT" value="450KM" />
                  </div>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4">
                    <button 
                      onClick={() => {
                          setViewMode('map');
                      }}
                      className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all flex items-center"
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Engage Tactical Map
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, scale: 0.7, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full h-full relative"
                >
                  <ReliefMap />
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(99,102,241,0.2)]"></div>
                  <button 
                    onClick={() => setViewMode('globe')}
                    className="absolute top-6 left-6 z-[1000] px-4 py-2 bg-neutral-900/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all"
                  >
                    ← Return to Orbit
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Public Interface Sidebar */}
          <div className="space-y-6 xl:h-full xl:overflow-y-auto custom-scrollbar pr-2 pb-10 xl:pb-0 flex flex-col justify-start xl:pt-4">
             
             {/* Amazon-Style Donation Tracker */}
             <DonationTracker 
               trackingId="#DR-8832" 
               itemName="Medical First Aid Kits" 
               quantity={50} 
             />

             {/* Current Critical Needs Feed */}
             <div className="glass-card p-6 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)] mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-2" />
                    Current Critical Needs
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-bold">LIVE UPDATE</span>
                </div>
                
                <div className="space-y-4">
                  {/* Need Item 1 */}
                  <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 flex justify-between items-center group hover:border-red-500/50 transition-colors">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                           <Heart className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">O-Negative Blood Supply</p>
                           <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-0.5">AEC Main Shelter</p>
                        </div>
                     </div>
                     <Link href="/donations" className="px-3 py-1.5 bg-neutral-800 hover:bg-red-600 text-white text-[10px] font-bold uppercase rounded text-center transition-colors">
                        Fulfill
                     </Link>
                  </div>

                  {/* Need Item 2 */}
                  <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 flex justify-between items-center group hover:border-amber-500/50 transition-colors">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                           <Zap className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">Diesel Fuel (Generators)</p>
                           <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">Jalukbari Center</p>
                        </div>
                     </div>
                     <Link href="/donations" className="px-3 py-1.5 bg-neutral-800 hover:bg-amber-600 text-white text-[10px] font-bold uppercase rounded text-center transition-colors">
                        Fulfill
                     </Link>
                  </div>

                  {/* Need Item 3 */}
                  <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 flex justify-between items-center group hover:border-blue-500/50 transition-colors">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                           <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">Heavy Duty Tarpaulins</p>
                           <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">GU Hub</p>
                        </div>
                     </div>
                     <Link href="/donations" className="px-3 py-1.5 bg-neutral-800 hover:bg-blue-600 text-white text-[10px] font-bold uppercase rounded text-center transition-colors">
                        Fulfill
                     </Link>
                  </div>
                </div>
             </div>

             {/* Public Actions */}
             <Link href="/report" className="block p-5 bg-white text-black rounded-2xl shadow-xl shadow-white/5 hover:scale-[1.02] transition-all transform origin-top mt-6">
                <div className="flex items-center justify-between mb-1">
                   <h4 className="font-black text-sm uppercase tracking-tight">Report Status</h4>
                   <MessageSquarePlus className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-medium opacity-70">Contribute real-time data from your sector.</p>
             </Link>
          </div>
        </section>

        {/* Strategic Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
           <FeatureCard 
             title="Resilience Hub" 
             desc="Find and navigate to the nearest active relief centers at AEC Guwahati."
             icon={Navigation}
             href="/camps"
           />
           <FeatureCard 
             title="Transparency Ledger" 
             desc="Unified donation and allocation tracking to ensure zero leakages."
             icon={Heart}
             href="/donations"
           />
           <FeatureCard 
             title="Inventory Matrix" 
             desc="Real-time shortage prediction and supply chain monitoring."
             icon={Users}
             href="/resources"
           />
        </section>
      </div>
    </DashboardLayout>
  );
}

function HUDIndicator({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/5 p-3 rounded-xl min-w-[120px]">
       <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">{label}</p>
       <p className="text-xs font-black text-white italic tracking-tighter">{value}</p>
    </div>
  );
}

function MiniStats({ label, value, trend, color = "text-white" }: { label: string, value: string, trend: string, color?: string }) {
  return (
    <div className="flex items-end justify-between border-l-2 border-indigo-500/20 pl-4">
       <div>
          <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-xl font-black ${color} tracking-tighter`}>{value}</p>
       </div>
       <span className="text-[9px] font-bold text-neutral-400 opacity-60 italic">{trend}</span>
    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon, href }: { title: string, desc: string, icon: any, href: string }) {
  return (
    <Link href={href} className="glass-panel p-8 rounded-3xl hover:border-indigo-500/30 group transition-all">
       <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all mb-6">
          <Icon className="w-6 h-6 text-neutral-400 group-hover:text-indigo-400" />
       </div>
       <h3 className="text-xl font-black text-white mb-3 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{title}</h3>
       <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">{desc}</p>
    </Link>
  );
}
