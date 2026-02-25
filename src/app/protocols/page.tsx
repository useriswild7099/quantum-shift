'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Activity,
  Droplets,
  Wind,
  Flame,
  ThermometerSun,
  Snowflake,
  Waves,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

const protocols = [
  {
    id: 'eq',
    icon: Activity,
    title: 'Earthquakes',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    dos: [
      'Repair deep plaster cracks in ceilings and foundations.',
      'Anchor overhead lighting fixtures to the ceiling.',
      'Follow BIS codes relevant to your area for building standards.',
      'Drop to the ground; take cover by getting under a sturdy table.'
    ],
    donts: [
      'Do not move from where you are during the shaking.',
      'Do not light a match or use open flames.',
      'Do not use elevators during or immediately after the quake.'
    ]
  },
  {
    id: 'fl',
    icon: Droplets,
    title: 'Floods (Rainy Season)',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    dos: [
      'Listen to radio, watch TV, read newspapers for weather updates.',
      'Move to higher ground immediately if flooding is imminent.',
      'Drink boiled or purified water only.'
    ],
    donts: [
      'Stay away from electric poles and fallen power lines to avoid electrocution.',
      'Do not allow children to play in or near flood waters.',
      "Don't use any damaged electrical goods, get them checked."
    ]
  },
  {
    id: 'cy',
    icon: Wind,
    title: 'Cyclones',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    dos: [
      'Check the house; secure loose tiles and carry out repairs of doors and windows.',
      'Keep some wooden boards ready so that glass windows can be boarded if needed.',
      'Keep a hurricane lantern filled with kerosene, battery operated torches and enough dry cells.'
    ],
    donts: [
      'DO NOT venture out even when the winds appear to calm down (eye of the storm).',
      'Do not shelter under trees or weak structures.'
    ]
  },
  {
    id: 'hw',
    icon: ThermometerSun,
    title: 'Heat Waves (Summer)',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    dos: [
      'Wear lightweight, light-coloured, loose, cotton clothes.',
      'Drink sufficient water, even if not thirsty.',
      'Use ORS, homemade drinks like lassi, torani (rice water), lemon water, buttermilk.'
    ],
    donts: [
      'Avoid going out in the sun, especially between 12.00 noon and 3.00 p.m.',
      'Avoid strenuous activities when outside in the afternoon.',
      'Avoid alcohol, tea, coffee and carbonated soft drinks, which dehydrates the body.'
    ]
  }
];

export default function ProtocolsPage() {
  const [activeProtoId, setActiveProtoId] = useState(protocols[0].id);

  const activeProto = protocols.find(p => p.id === activeProtoId) || protocols[0];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 w-max">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Classified Survival Tactics</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Standard Operating Procedures</h1>
          <p className="text-neutral-400">NDMA-mandated action plans for dynamic threat vectors.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar selector */}
          <div className="col-span-1 space-y-2">
            {protocols.map((proto) => {
              const isActive = activeProtoId === proto.id;
              return (
                <button
                  key={proto.id}
                  onClick={() => setActiveProtoId(proto.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${
                    isActive 
                      ? `${proto.bgColor} ${proto.borderColor} shadow-[0_0_20px_rgba(0,0,0,0.5)]` 
                      : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800/80 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <proto.icon className={`w-5 h-5 ${isActive ? proto.color : 'text-neutral-500'}`} />
                    <span className={`font-bold ${isActive ? 'text-white' : ''}`}>{proto.title}</span>
                  </div>
                  {isActive && <ChevronRight className={`w-4 h-4 ${proto.color}`} />}
                </button>
              );
            })}
          </div>

          {/* Protocol Details Panel */}
          <div className="col-span-1 lg:col-span-3">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeProto.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="glass-panel rounded-2xl border border-neutral-800 relative overflow-hidden"
               >
                 <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${activeProto.color.split('-')[1]}-500 to-transparent`}></div>
                 <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
                 
                 <div className="p-8 relative z-10 space-y-8">
                   <div className="flex items-center space-x-4 border-b border-neutral-800 pb-6">
                     <div className={`p-4 rounded-xl ${activeProto.bgColor} ${activeProto.borderColor} border`}>
                        <activeProto.icon className={`w-8 h-8 ${activeProto.color}`} />
                     </div>
                     <div>
                       <h2 className="text-3xl font-black text-white">{activeProto.title} Protocol</h2>
                       <p className="font-mono text-sm text-neutral-500 uppercase tracking-widest">Threat Code: {activeProto.id.toUpperCase()}-01</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Do's Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           <h3 className="text-xl font-bold text-white uppercase tracking-wider">Mandatory Actions (Do's)</h3>
                        </div>
                        <ul className="space-y-3">
                          {activeProto.dos.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-3 text-neutral-300 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
                               <span className="font-mono text-emerald-500 text-xs mt-0.5">[{idx + 1}]</span>
                               <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Don'ts Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 rounded-full bg-red-500"></div>
                           <h3 className="text-xl font-bold text-white uppercase tracking-wider">Strictly Prohibited (Don'ts)</h3>
                        </div>
                        <ul className="space-y-3">
                          {activeProto.donts.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-3 text-neutral-300 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
                               <span className="font-mono text-red-500 text-xs mt-0.5">[X]</span>
                               <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                   </div>

                 </div>
               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
