'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation2, CheckCircle, Package, Truck, ArrowRight, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function VolunteerDriverUI() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [incomingTask, setIncomingTask] = useState<any>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<'picking_up' | 'in_transit' | 'delivered'>('picking_up');

  // Simulate receiving a task when going online
  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline && !activeTask && !incomingTask) {
      setTimeout(() => {
        setIncomingTask({
          id: 'TASK-9942',
          title: 'Transport Medical Kits',
          from: 'AEC Main Supply Depot',
          to: 'Camp Delta (Jalukbari)',
          distance: '3.2 miles',
          estTime: '14 mins',
          payment: 'High Priority',
        });
      }, 3000);
    } else {
      setIncomingTask(null);
    }
  };

  const acceptTask = () => {
    setActiveTask(incomingTask);
    setIncomingTask(null);
    setDeliveryStatus('picking_up');
  };

  const rejectTask = () => {
    setIncomingTask(null);
  };

  const advanceDelivery = () => {
     if (deliveryStatus === 'picking_up') setDeliveryStatus('in_transit');
     else if (deliveryStatus === 'in_transit') {
       setDeliveryStatus('delivered');
       setTimeout(() => {
         setActiveTask(null);
         setDeliveryStatus('picking_up');
         // Simulate new task
         toggleOnline(); 
         toggleOnline();
       }, 3000);
     }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto h-[calc(100vh-8rem)] relative rounded-[40px] border-8 border-neutral-900 overflow-hidden shadow-2xl bg-neutral-950 flex flex-col">
        
        {/* Map Background (Simulated) */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/13/6122/3516.png')] opacity-30 grayscale contrast-150 mix-blend-screen scale-150 animate-pulse transition-all duration-10000 ease-linear"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>
        </div>

        {/* Uber Header Toggle */}
        <div className="relative z-10 pt-8 pb-4 px-6 flex justify-between items-center bg-gradient-to-b from-neutral-950 to-transparent">
          <div className="flex flex-col">
            <span className="text-sm font-black text-white px-3 py-1 bg-white/10 rounded-full inline-block backdrop-blur-md border border-white/5">
              ${activeTask ? '24.50' : '0.00'} <span className="text-neutral-500 font-medium">earned today</span>
            </span>
          </div>

          <button 
            onClick={toggleOnline}
            className={`relative w-24 h-12 rounded-full transition-colors flex items-center px-1 shadow-inner ${isOnline ? 'bg-blue-600' : 'bg-neutral-800'}`}
          >
            <motion.div 
              animate={{ x: isOnline ? 48 : 0 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-blue-600' : 'bg-neutral-500'}`}></div>
            </motion.div>
            <span className={`absolute font-black text-[10px] uppercase tracking-widest ${isOnline ? 'left-3 text-white' : 'right-3 text-neutral-500'}`}>
              {isOnline ? 'On' : 'Off'}
            </span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative z-10 flex flex-col justify-end p-4 pb-8">
          
          {/* Offline State */}
          {!isOnline && !activeTask && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-20">
              <div className="w-20 h-20 bg-neutral-900 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-neutral-800">
                 <Navigation2 className="w-8 h-8 text-neutral-600" />
              </div>
              <h2 className="text-2xl font-black text-white">You're Offline</h2>
              <p className="text-neutral-500 mt-2 font-medium">Go online to receive deployment pings.</p>
            </motion.div>
          )}

          {/* Finding Tasks State */}
          {isOnline && !incomingTask && !activeTask && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pb-20">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-blue-500/40 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute inset-0 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-md">
                   <Navigation2 className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white">Scanning Data...</h2>
              <p className="text-blue-400 mt-2 font-medium animate-pulse">Waiting for dispatch orders</p>
            </motion.div>
          )}

          {/* Incoming Task Popup */}
          <AnimatePresence>
            {incomingTask && (
              <motion.div 
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] w-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800">
                  <motion.div initial={{ width: '100%' }} animate={{ width: 0 }} transition={{ duration: 15, ease: 'linear' }} className="h-full bg-blue-500" />
                </div>
                
                <div className="text-center mb-6">
                   <span className="text-blue-400 font-black tracking-widest text-[10px] uppercase bg-blue-500/10 px-3 py-1 rounded-full mb-3 inline-block">New Dispatch</span>
                   <h3 className="text-3xl font-black text-white tracking-tight">{incomingTask.estTime}</h3>
                   <p className="text-neutral-400 font-medium">away &bull; {incomingTask.distance}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800/50">
                    <Package className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-white text-sm">{incomingTask.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Pickup: {incomingTask.from}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button onClick={rejectTask} className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-neutral-700 transition-colors flex-shrink-0">
                    <X className="w-6 h-6" />
                  </button>
                  <button onClick={acceptTask} className="flex-1 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
                    ACCEPT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Task Route UI */}
          <AnimatePresence>
            {activeTask && (
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-black text-lg">{activeTask.title}</h3>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">{activeTask.id}</p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
                     {deliveryStatus === 'picking_up' ? <Package className="w-5 h-5 text-white" /> : <Truck className="w-5 h-5 text-white" />}
                  </div>
                </div>

                {/* Route visualization */}
                <div className="relative pl-6 space-y-6 mb-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                   <div className="relative">
                     <span className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-neutral-900 ${deliveryStatus === 'picking_up' ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-neutral-600'}`}></span>
                     <p className={`text-sm font-bold ${deliveryStatus === 'picking_up' ? 'text-white' : 'text-neutral-500'}`}>{activeTask.from}</p>
                     <p className="text-xs text-neutral-500">Pickup Location</p>
                   </div>
                   <div className="relative">
                     <span className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-neutral-900 ${deliveryStatus === 'in_transit' ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-neutral-600'}`}></span>
                     <p className={`text-sm font-bold ${deliveryStatus === 'in_transit' ? 'text-white' : 'text-neutral-500'}`}>{activeTask.to}</p>
                     <p className="text-xs text-neutral-500">Dropoff Location</p>
                   </div>
                </div>

                {/* Swipe Action Simulation */}
                {deliveryStatus !== 'delivered' ? (
                  <button 
                    onClick={advanceDelivery}
                    className={`w-full h-14 rounded-xl flex items-center justify-center font-black text-white text-sm uppercase tracking-wider relative overflow-hidden transition-colors ${
                      deliveryStatus === 'picking_up' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                  >
                     <motion.div 
                       className="absolute left-1 bottom-1 top-1 w-12 bg-white/20 rounded-lg flex items-center justify-center pointer-events-none"
                     >
                       <ArrowRight className="w-5 h-5" />
                     </motion.div>
                     {deliveryStatus === 'picking_up' ? 'Confirm Pickup' : 'Confirm Delivery'}
                  </button>
                ) : (
                  <div className="w-full h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center space-x-2 text-emerald-400 font-black">
                     <CheckCircle className="w-5 h-5" />
                     <span>TASK COMPLETED</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
}
