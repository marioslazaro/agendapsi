import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Frequency = 'Semanal' | 'Quinzenal' | 'Mensal';

export interface Patient {
  id: string;
  name: string;
  phone: string;
  frequency: Frequency;
  observations?: string;
  birthDate?: string;
  createdAt: number;
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
export type PaymentStatus = 'Paid' | 'Pending';

export interface Appointment {
  id: string;
  patientId: string;
  date: number; // timestamp
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  value: number;
}

interface AppState {
  patients: Patient[];
  appointments: Appointment[];
  
  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  addAppointment: (app: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  deleteAccount: () => void;
  
  user: { name: string; email: string; avatarUrl?: string } | null;
  login: (userData: { name: string; email: string; avatarUrl?: string }) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      patients: [],
      appointments: [],

      addPatient: (patientData) => set((state) => ({
        patients: [...state.patients, { 
          ...patientData, 
          id: Math.random().toString(36).substr(2, 9), 
          createdAt: Date.now() 
        }]
      })),
      
      updatePatient: (id, data) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...data } : p)
      })),

      addAppointment: (appData) => set((state) => ({
        appointments: [...state.appointments, {
          ...appData,
          id: Math.random().toString(36).substr(2, 9)
        }]
      })),

      updateAppointment: (id, data) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...data } : a)
      })),

      cancelAppointment: (id) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a)
      })),

      deleteAccount: () => set({ patients: [], appointments: [], user: null }),

      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'psych-app-storage',
    }
  )
);
