import axiosInstance from './axiosInstance';
import type { ApiResponse, ILead, LeadFormData } from '../types';

export const getLeadsApi = async (): Promise<ApiResponse<{ leads: ILead[] }>> => {
  const response = await axiosInstance.get('/leads');
  return response.data;
};

export const createLeadApi = async (
  data: LeadFormData
): Promise<ApiResponse<{ lead: ILead }>> => {
  const response = await axiosInstance.post('/leads', data);
  return response.data;
};

export const updateLeadApi = async (
  id: string,
  status: string
): Promise<ApiResponse<{ lead: ILead }>> => {
  const response = await axiosInstance.put(`/leads/${id}`, { status });
  return response.data;
};

export const deleteLeadApi = async (
  id: string
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete(`/leads/${id}`);
  return response.data;
};
