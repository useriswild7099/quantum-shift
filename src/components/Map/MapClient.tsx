'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // This adds L.heatLayer to the Leaflet namespace
import { useAppStore } from '@/store/useAppStore';

// Fix for default marker icons in React-Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Heatmap Layer Component
function HeatLayer() {
  const map = useMap();
  const incidentReports = useAppStore(state => state.incidentReports);

  const [realMissions, setRealMissions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/datasets/parsed_disasters.json')
      .then(res => res.json())
      .then(data => setRealMissions(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!incidentReports.length && !realMissions.length) return;

    // Heat points: [lat, lng, intensity]
    const heatPoints = [
      ...incidentReports.map(r => [
        r.location.lat, 
        r.location.lng, 
        r.intensity * 2.0 // Scale for visibility
      ]),
      ...realMissions.map((r: any) => [
        r.lat,
        r.lng,
        0.5 // Default intensity for historical
      ])
    ] as [number, number, number][];

    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 35,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.4: 'cyan', 0.65: 'lime', 1: 'red' }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [incidentReports, realMissions, map]);

  return null;
}

// Auto-center map to bounds of all camps
function MapBounds() {
  const camps = useAppStore(state => state.camps);
  const map = useMap();

  useEffect(() => {
    if (camps.length > 0) {
      const bounds = L.latLngBounds(camps.map(c => [c.location.lat, c.location.lng]));
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 15 });
    }
  }, [camps, map]);

  return null;
}

export default function MapClient() {
  const camps = useAppStore(state => state.camps);

  return (
    <div className="w-full h-full relative group">
      {/* Cinematic HUD Elements Wrapper */}
      <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-white/5 rounded-xl overflow-hidden">
         <div className="scanline"></div>
      </div>

      <MapContainer 
        center={[26.1388, 91.6625]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="rounded-xl overflow-hidden shadow-2xl grayscale-[0.2] contrast-[1.1]"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <HeatLayer />
        <MapBounds />
        
        {camps.map(camp => (
          <Marker key={camp.id} position={[camp.location.lat, camp.location.lng]}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-base text-white border-b border-white/10 pb-1 mb-2">{camp.name}</h3>
                <div className="space-y-1.5">
                   <p className="text-xs flex justify-between">
                     <span className="text-neutral-400">Status:</span>
                     <span className={camp.status === 'Over Capacity' ? 'text-red-400 font-black' : 'text-emerald-400 font-black'}>{camp.status}</span>
                   </p>
                   <p className="text-xs flex justify-between">
                     <span className="text-neutral-400">Capacity:</span>
                     <span className="text-white font-mono">{Math.round((camp.currentOccupancy/camp.capacity)*100)}%</span>
                   </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Viewport HUD */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-3">
           <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Heat: Active</span>
           </div>
           <div className="w-[1px] h-3 bg-neutral-700"></div>
           <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-tighter italic">L.HeatLayer Ver 1.4.2</span>
        </div>
      </div>
    </div>
  );
}
