import { create } from 'zustand';
import { Volunteer, Camp, Resource, Task, Donation, Alert, IncidentReport } from '../lib/types';
import { submitIncidentReportAction, processDonationAction } from '../actions/mutations';

interface AppState {
  // Core Entities
  volunteers: Volunteer[];
  camps: Camp[];
  resources: Resource[];
  tasks: Task[];
  donations: Donation[];
  alerts: Alert[];
  incidentReports: IncidentReport[];
  isHydrated: boolean;
  userRole: 'public' | 'volunteer' | 'government' | null;

  // Actions
  setHydratedState: (state: Partial<AppState>) => void;
  setRole: (role: 'public' | 'volunteer' | 'government' | null) => void;
  addVolunteer: (volunteer: Volunteer) => void;
  updateVolunteerStatus: (id: string, status: Volunteer['status']) => void;
  assignVolunteerToTask: (volunteerId: string, taskId: string) => void;
  
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  markAlertRead: (id: string) => void;
  
  consumeResource: (resourceId: string, amount: number) => void;
  addIncidentReport: (report: Omit<IncidentReport, 'id' | 'timestamp' | 'status'>) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'status'>) => void;
}

// Initial Tasks and Alerts remain local for UI demonstration logic
const initialTasks: Task[] = [
  { id: 'task-1', title: 'Triage Incoming Evacuees', description: 'Need medical staff to triage 50 incoming evacuees at AEC Main shelter.', requiredSkills: ['Medical'], campId: 'camp-1', status: 'Open', assignedVolunteerIds: [] },
  { id: 'task-2', title: 'Setup Comm Relay', description: 'Establish satellite uplinks at Jalukbari center.', requiredSkills: ['Communication'], campId: 'camp-2', status: 'In Progress', assignedVolunteerIds: ['vol-2'] },
];

const initialAlerts: Alert[] = [
  { id: 'alert-1', type: 'Critical', message: 'AEC Campus Main Shelter is nearly over capacity. Divert new evacuees.', timestamp: new Date().toISOString(), relatedCampId: 'camp-1', isRead: false },
  { id: 'alert-2', type: 'Warning', message: 'GU Hub fuel reserves < 24 hrs.', timestamp: new Date(Date.now() - 3600000).toISOString(), relatedCampId: 'camp-3', isRead: false },
];

export const useAppStore = create<AppState>((set, get) => ({
  volunteers: [],
  camps: [],
  resources: [],
  tasks: initialTasks,
  donations: [],
  alerts: initialAlerts,
  incidentReports: [],
  isHydrated: false, // Ensures UI waits for DB load if needed
  userRole: null, // Default to null to force login selection

  setHydratedState: (state) => set(() => ({ ...state, isHydrated: true })),
  setRole: (role) => set(() => ({ userRole: role })),

  addVolunteer: (volunteer) => set((state) => ({ volunteers: [...state.volunteers, volunteer] })),
  
  updateVolunteerStatus: (id, status) => set((state) => ({
    volunteers: state.volunteers.map(v => v.id === id ? { ...v, status } : v)
  })),

  assignVolunteerToTask: (volunteerId, taskId) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return state;

    return {
      tasks: state.tasks.map(t => 
        t.id === taskId 
          ? { ...t, assignedVolunteerIds: [...t.assignedVolunteerIds, volunteerId], status: 'In Progress' }
          : t
      ),
      volunteers: state.volunteers.map(v => 
        v.id === volunteerId
          ? { ...v, status: 'Deployed', assignedCampId: task.campId }
          : v
      )
    };
  }),

  addAlert: (alertData) => set((state) => ({
    alerts: [{ ...alertData, id: `alert-${Date.now()}`, timestamp: new Date().toISOString() }, ...state.alerts]
  })),

  markAlertRead: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
  })),

  consumeResource: (resourceId, amount) => set((state) => {
    let newAlerts = [...state.alerts];
    const newResources = state.resources.map(r => {
      if (r.id === resourceId) {
        const remaining = Math.max(0, r.quantity - amount);
        const isCritical = remaining < 10;
        
        if (isCritical && !r.isCriticalShortage) {
           newAlerts = [{
             id: `alert-auto-${Date.now()}`,
             type: 'Critical',
             message: `CRITICAL SHORTAGE: ${r.name} running low!`,
             timestamp: new Date().toISOString(),
             relatedCampId: r.campId,
             isRead: false
           }, ...newAlerts];
        }
        
        return { ...r, quantity: remaining, isCriticalShortage: isCritical };
      }
      return r;
    });

    return { resources: newResources, alerts: newAlerts };
  }),

  addDonation: async (donation) => {
    // Optimistic UI update
    const tempId = `don-temp-${Date.now()}`;
    const optimisticDonation: Donation = { ...donation, id: tempId, status: 'Processing' } as Donation;
    
    set((state) => ({
      donations: [optimisticDonation, ...state.donations]
    }));

    // Server Action
    const result = await processDonationAction(donation);
    if (result.success && result.data) {
      set((state) => ({
        donations: state.donations.map(d => d.id === tempId ? result.data as Donation : d)
      }));
    }
  },

  addIncidentReport: async (report) => {
    // Optimistic UI update
    const tempId = `repo-temp-${Date.now()}`;
    const optimisticReport: IncidentReport = { ...report, id: tempId, timestamp: new Date().toISOString(), status: 'Pending' } as IncidentReport;

    set((state) => ({
      incidentReports: [optimisticReport, ...state.incidentReports]
    }));

    // Server Action
    const result = await submitIncidentReportAction(report);
    if (result.success && result.data) {
      set((state) => ({
        incidentReports: state.incidentReports.map(r => r.id === tempId ? result.data as IncidentReport : r)
      }));
    }
  }
}));
