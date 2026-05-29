export type LeadStatus = 'Interested' | 'Not Interested' | 'Converted';
export type LeadSource = 'Call' | 'WhatsApp' | 'Field';

export interface ILead {
  id: string;
  name: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LeadFormData {
  name: string;
  phone: string;
  source: LeadSource;
}
