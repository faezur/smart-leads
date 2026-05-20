import { create } from 'zustand';
import type { ILead, LeadFilters, LeadFormData, PaginationMeta } from '../types';
import {
  getLeadsApi,
  createLeadApi,
  updateLeadApi,
  deleteLeadApi,
  exportLeadsCSVApi,
} from '../api/leadApi';

interface LeadState {
  leads: ILead[];
  selectedLead: ILead | null;
  pagination: PaginationMeta | null;
  filters: LeadFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  fetchLeads: (filters?: LeadFilters) => Promise<void>;
  createLead: (data: LeadFormData) => Promise<void>;
  updateLead: (id: string, data: Partial<LeadFormData>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  exportCSV: () => Promise<void>;
  setFilters: (filters: Partial<LeadFilters>) => void;
  setSelectedLead: (lead: ILead | null) => void;
  clearError: () => void;
}

const useLeadStore = create<LeadState>()((set, get) => ({
  leads: [],
  selectedLead: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 10,
    status: '',
    source: '',
    search: '',
    sort: 'latest',
  },
  isLoading: false,
  isSubmitting: false,
  error: null,

  // Fetch leads with current filters
  fetchLeads: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = filters || get().filters;

      // Remove empty filters before sending to API
      const cleanFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '')
      );

      const response = await getLeadsApi(cleanFilters);
      set({
        leads: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || 'Failed to fetch leads';
      set({ error: message, isLoading: false });
    }
  },

  // Create new lead
  createLead: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      await createLeadApi(data);
      // Refresh leads list after create
      await get().fetchLeads();
      set({ isSubmitting: false });
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || 'Failed to create lead';
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  // Update existing lead
  updateLead: async (id, data) => {
    set({ isSubmitting: true, error: null });
    try {
      await updateLeadApi(id, data);
      // Refresh leads list after update
      await get().fetchLeads();
      set({ isSubmitting: false });
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || 'Failed to update lead';
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  // Delete lead
  deleteLead: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteLeadApi(id);
      // Refresh leads list after delete
      await get().fetchLeads();
      set({ isLoading: false });
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || 'Failed to delete lead';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Export leads as CSV
  exportCSV: async () => {
    try {
      await exportLeadsCSVApi();
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || 'Failed to export CSV';
      set({ error: message });
    }
  },

  // Update filters and refetch
  setFilters: (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters, page: 1 };
    set({ filters: updatedFilters });
    get().fetchLeads(updatedFilters);
  },

  // Set selected lead for edit/view
  setSelectedLead: (lead) => set({ selectedLead: lead }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useLeadStore;