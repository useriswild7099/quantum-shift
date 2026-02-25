'use client';

import { useAppStore } from '@/store/useAppStore';
import { Heart, Search, DollarSign, ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function DonationsPage() {
  const { donations, camps } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  
  const filteredDonations = donations.filter(d => 
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Donation Transparency Ledger</h2>
          <p className="text-neutral-400 mt-1">Real-time unalterable record of contributions and allocations.</p>
        </div>

        {/* Global Impact Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-8 flex items-center justify-between shadow-lg">
          <div>
             <h3 className="text-indigo-300 font-semibold mb-2">Total Contributions Processed</h3>
             <div className="flex items-baseline space-x-2">
               <DollarSign className="w-8 h-8 text-white" />
               <span className="text-5xl font-black text-white tracking-tight">{totalDonations.toLocaleString()}</span>
               <span className="text-indigo-200 font-medium">USD</span>
             </div>
          </div>
          <div className="hidden md:flex p-4 bg-white/5 rounded-full ring-1 ring-white/10 backdrop-blur-sm">
             <Heart className="w-16 h-16 text-indigo-400" />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
            <h3 className="font-semibold">Public Ledger</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search donor or purpose..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-neutral-900/80 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Donor Entity</th>
                  <th className="px-6 py-4 font-semibold">Amount (USD)</th>
                  <th className="px-6 py-4 font-semibold">Stated Purpose</th>
                  <th className="px-6 py-4 font-semibold">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredDonations.map(donation => {
                  const camp = camps.find(c => c.id === donation.allocatedToCampId);
                  const date = new Date(donation.date);
                  
                  return (
                    <tr key={donation.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                        {date.toLocaleDateString()} <span className="opacity-50 ml-1">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {donation.donorName}
                      </td>
                      <td className="px-6 py-4 font-mono text-emerald-400 font-bold whitespace-nowrap">
                        + ${donation.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-neutral-300">
                        {donation.purpose}
                      </td>
                      <td className="px-6 py-4">
                        {camp ? (
                          <div className="flex items-center text-indigo-400 font-medium whitespace-nowrap">
                             <ArrowRight className="w-4 h-4 mr-2" />
                             {camp.name}
                          </div>
                        ) : (
                          <span className="text-neutral-500 italic">General Fund (Pending Allocation)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                
                {filteredDonations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      No records found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
