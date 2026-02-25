'use client';

import { useAppStore } from '@/store/useAppStore';
import { Bot, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function VolunteersPage() {
  const { volunteers, tasks, assignVolunteerToTask } = useAppStore();
  const [matchingStatus, setMatchingStatus] = useState<Record<string, 'idle'|'matching'|'matched'>>({});

  const openTasks = tasks.filter(t => t.status === 'Open');
  const availableVols = volunteers.filter(v => v.status === 'Available');

  // AI/Rule-based task matching logic
  const handleAutoMatch = (taskId: string, requiredSkills: string[]) => {
    setMatchingStatus(prev => ({ ...prev, [taskId]: 'matching' }));
    
    setTimeout(() => {
      // Find a volunteer who has at least one of the required skills
      const match = availableVols.find(v => 
        v.skills.some(skill => requiredSkills.includes(skill))
      );

      if (match) {
        assignVolunteerToTask(match.id, taskId);
        setMatchingStatus(prev => ({ ...prev, [taskId]: 'matched' }));
      } else {
        alert("No available volunteers with the required skills found.");
        setMatchingStatus(prev => ({ ...prev, [taskId]: 'idle' }));
      }
    }, 1200); // Simulate "AI processing" delay
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Volunteers & Task Allocation</h2>
          <p className="text-neutral-400 mt-1">Manage personnel and intelligently assign urgent tasks.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Urgent Tasks (AI Matching) */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
              <h3 className="font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-400" />
                Unassigned Urgent Tasks
              </h3>
              <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20">
                {openTasks.length} Pending
              </span>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {openTasks.length === 0 ? (
                 <div className="text-center py-12 text-neutral-500">
                   <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                   <p>All clear. No urgent unassigned tasks.</p>
                 </div>
              ) : (
                openTasks.map(task => (
                  <div key={task.id} className="p-5 bg-neutral-800/80 rounded-xl border border-neutral-700 hover:border-indigo-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-white">{task.title}</h4>
                      <div className="flex gap-1">
                        {task.requiredSkills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-neutral-950 text-indigo-300 text-[10px] rounded uppercase font-bold tracking-wider border border-neutral-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-400 mb-4">{task.description}</p>
                    
                    <button 
                      onClick={() => handleAutoMatch(task.id, task.requiredSkills)}
                      disabled={matchingStatus[task.id] === 'matching'}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center transition-all ${
                        matchingStatus[task.id] === 'matching' 
                          ? 'bg-neutral-700 text-neutral-400 border border-neutral-600 cursor-not-allowed'
                          : matchingStatus[task.id] === 'matched'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                      }`}
                    >
                      {matchingStatus[task.id] === 'matching' ? (
                         <>
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                           AI Matching in progress...
                         </>
                      ) : matchingStatus[task.id] === 'matched' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Match Found & Assigned
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4 mr-2" />
                          Auto-Match Best Volunteer
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Volunteer Roster */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
              <h3 className="font-semibold">Full Volunteer Roster</h3>
              <span className="text-xs text-neutral-500">{volunteers.length} Total</span>
            </div>
            
            <div className="overflow-y-auto flex-1 p-0">
               <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-400 uppercase bg-neutral-900/80 sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Skills</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {volunteers.map(vol => (
                    <tr key={vol.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{vol.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          vol.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          vol.status === 'Deployed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        }`}>
                          {vol.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {vol.skills.map(s => (
                            <span key={s} className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-xs">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
