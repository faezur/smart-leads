import axiosInstance from './axiosInstance';
import type{ ApiResponse, ILead, LeadFilters, LeadFormData, PaginatedResponse } from '../types/index.ts';

// Get all leads with filters
export const getLeadsApi = async (
  filters: LeadFilters
): Promise<PaginatedResponse<ILead>> => {
  const response = await axiosInstance.get('/leads', { params: filters });
  return response.data;
};

// Get single lead
export const getLeadByIdApi = async (
  id: string
): Promise<ApiResponse<{ lead: ILead }>> => {
  const response = await axiosInstance.get(`/leads/${id}`);
  return response.data;
};

// Create lead
export const createLeadApi = async (
  data: LeadFormData
): Promise<ApiResponse<{ lead: ILead }>> => {
  const response = await axiosInstance.post('/leads', data);
  return response.data;
};

// Update lead
export const updateLeadApi = async (
  id: string,
  data: Partial<LeadFormData>
): Promise<ApiResponse<{ lead: ILead }>> => {
  const response = await axiosInstance.put(`/leads/${id}`, data);
  return response.data;
};

// Delete lead
export const deleteLeadApi = async (
  id: string
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete(`/leads/${id}`);
  return response.data;
};

// Export leads as CSV
export const exportLeadsCSVApi = async (): Promise<void> => {
  const response = await axiosInstance.get('/leads/export/csv', {
    responseType: 'blob', // important — binary data hai CSV
  });

  // Create download link and click it automatically
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'leads.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};