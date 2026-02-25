'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/UI/Skeleton';

// Because React-Leaflet requires the window object (which isn't available during SSR),
// we dynamically import the Map component and disable SSR.
const MapClient = dynamic(() => import('./MapClient'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-900 animate-pulse rounded-xl shadow-2xl border border-neutral-800 flex items-center justify-center">
      <p className="text-neutral-500 font-medium">Loading geospatial data...</p>
    </div>
  )
});

export function ReliefMap() {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900">
      <MapClient />
    </div>
  );
}
