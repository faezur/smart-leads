import { create } from 'zustand';
import type { ILead, LeadFormData } from '../types';
import {
  getLeadsApi,
  createLeadApi,
  updateLeadApi,
  deleteLeadApi,
} from '../api/leadApi';

interface LeadState {
  leads: ILead[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  createLead: (data: LeadFormData) => Promise<void>;
  updateLeadStatus: (id: string, status: string) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  clearError: () => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as any)?.response?.data?.message || fallback;

const useLeadStore = create<LeadState>()((set, get) => ({
  leads: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getLeadsApi();
      set({ leads: response.data?.leads ?? [], isLoading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Failed to fetch leads'),
        isLoading: false,
      });
    }
  },

  createLead: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      await createLeadApi(data);
      await get().fetchLeads();
      set({ isSubmitting: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Failed to create lead'),
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateLeadStatus: async (id, status) => {
    set({ isSubmitting: true, error: null });
    try {
      await updateLeadApi(id, status);
      await get().fetchLeads();
      set({ isSubmitting: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Failed to update lead'),
        isSubmitting: false,
      });
      throw error;
    }
  },

  deleteLead: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteLeadApi(id);
      await get().fetchLeads();
      set({ isLoading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Failed to delete lead'),
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useLeadStore;
