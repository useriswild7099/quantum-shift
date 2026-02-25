'use client';

import { useAppStore } from '@/store/useAppStore';
import { Tent, Phone, MapPin, Users, AlertCircle } from 'lucide-react';

import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function CampsPage() {
  const camps = useAppStore(state => state.camps);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Relief Camps Locator</h2>
          <p className="text-neutral-400 mt-1">Monitor active camps, capacity levels, and critical shortfalls.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {camps.map(camp => {
            const isOverCapacity = camp.status === 'Over Capacity';
            const capacityPercentage = Math.round((camp.currentOccupancy / camp.capacity) * 100);

            return (
              <div 
                key={camp.id} 
                className={`bg-neutral-900 rounded-xl overflow-hidden shadow-sm border transition-all ${
                  isOverCapacity 
                    ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Camp Header */}
                <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-start bg-neutral-900/50">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${isOverCapacity ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <Tent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white leading-tight">{camp.name}</h3>
                      <div className="flex items-center mt-1 text-xs text-neutral-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        {camp.location.lat.toFixed(4)}, {camp.location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Capacity */}
                <div className="p-6 space-y-6">
                  
                  <div className="flex justify-between items-center">
                     <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-300">{camp.contactPhone}</span>
                     </div>
                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        isOverCapacity 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {camp.status}
                      </span>
                  </div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-neutral-400 flex items-center">
                        <Users className="w-4 h-4 mr-1.5" />
                        Current Occupancy
                      </span>
                      <span className="text-sm font-bold">
                        <span className={isOverCapacity ? 'text-red-400' : 'text-white'}>{camp.currentOccupancy}</span> 
                        <span className="text-neutral-500 font-normal"> / {camp.capacity}</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverCapacity ? 'bg-red-500' : capacityPercentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Critical Needs */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-400 mb-3 flex items-center">
                       <AlertCircle className="w-4 h-4 mr-1.5 text-orange-400" />
                       Critical Needs
                    </h4>
                    {camp.criticalNeeds.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {camp.criticalNeeds.map(need => (
                          <span key={need} className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider rounded-md">
                            {need}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500 italic">No critical needs reported.</p>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
