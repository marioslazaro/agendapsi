import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
  isLoading: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  addAppointment: (app: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  user: { id: string; name: string; email: string; avatarUrl?: string } | null;
  setUser: (userData: { id: string; name: string; email: string; avatarUrl?: string } | null) => void;
  logout: () => Promise<void>;

  subscriptionStatus: 'loading' | 'active' | 'expired' | 'none';
  checkSubscription: () => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  patients: [],
  appointments: [],
  isLoading: false,
  user: null,
  subscriptionStatus: 'loading',

  setUser: (userData) => set({ user: userData }),

  fetchData: async () => {
    const user = get().user;
    if (!user) return;
    set({ isLoading: true });

    const [patientsRes, appointmentsRes] = await Promise.all([
      supabase.from('patients').select('*'),
      supabase.from('appointments').select('*')
    ]);

    if (patientsRes.data) {
      set({ 
        patients: patientsRes.data.map(p => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          frequency: p.frequency as Frequency,
          observations: p.notes,
          birthDate: p.birth_date,
          createdAt: new Date(p.created_at).getTime()
        }))
      });
    }

    if (appointmentsRes.data) {
      set({
        appointments: appointmentsRes.data.map(a => ({
          id: a.id,
          patientId: a.patient_id,
          date: new Date(a.date).getTime(),
          status: a.status as AppointmentStatus,
          paymentStatus: a.payment_status as PaymentStatus,
          value: Number(a.payment_value)
        }))
      });
    }
    
    set({ isLoading: false });
  },

  addPatient: async (patientData) => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase.from('patients').insert([{
      user_id: user.id,
      name: patientData.name,
      phone: patientData.phone,
      frequency: patientData.frequency,
      notes: patientData.observations,
      birth_date: patientData.birthDate
    }]).select().single();

    if (!error && data) {
      const newPatient: Patient = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        frequency: data.frequency as Frequency,
        observations: data.notes,
        birthDate: data.birth_date,
        createdAt: new Date(data.created_at).getTime()
      };
      set((state) => ({ patients: [...state.patients, newPatient] }));
    }
  },
  
  updatePatient: async (id, data) => {
    const updates: any = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.frequency !== undefined) updates.frequency = data.frequency;
    if (data.observations !== undefined) updates.notes = data.observations;
    if (data.birthDate !== undefined) updates.birth_date = data.birthDate;

    const { error } = await supabase.from('patients').update(updates).eq('id', id);
    if (!error) {
      set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...data } : p)
      }));
    }
  },

  addAppointment: async (appData) => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase.from('appointments').insert([{
      user_id: user.id,
      patient_id: appData.patientId,
      date: new Date(appData.date).toISOString(),
      status: appData.status,
      payment_status: appData.paymentStatus,
      payment_value: appData.value
    }]).select().single();

    if (!error && data) {
      const newApp: Appointment = {
        id: data.id,
        patientId: data.patient_id,
        date: new Date(data.date).getTime(),
        status: data.status as AppointmentStatus,
        paymentStatus: data.payment_status as PaymentStatus,
        value: Number(data.payment_value)
      };
      set((state) => ({ appointments: [...state.appointments, newApp] }));
    }
  },

  updateAppointment: async (id, data) => {
    const updates: any = {};
    if (data.status !== undefined) updates.status = data.status;
    if (data.paymentStatus !== undefined) updates.payment_status = data.paymentStatus;
    if (data.value !== undefined) updates.payment_value = data.value;
    if (data.date !== undefined) updates.date = new Date(data.date).toISOString();

    const { error } = await supabase.from('appointments').update(updates).eq('id', id);
    if (!error) {
      set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...data } : a)
      }));
    }
  },

  cancelAppointment: async (id) => {
    const { error } = await supabase.from('appointments').update({ status: 'Cancelled' }).eq('id', id);
    if (!error) {
      set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a)
      }));
    }
  },

  deleteAccount: async () => {
    await supabase.auth.signOut();
    set({ patients: [], appointments: [], user: null });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, patients: [], appointments: [], subscriptionStatus: 'loading' });
  },

  checkSubscription: async () => {
    const user = get().user;
    if (!user) {
      set({ subscriptionStatus: 'none' });
      return;
    }
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      set({ subscriptionStatus: 'none' });
      return;
    }

    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (data.status === 'active' && expiresAt > now) {
      set({ subscriptionStatus: 'active' });
    } else {
      set({ subscriptionStatus: 'expired' });
    }
  },
}));
