// User types
export type UserRole = 'admin' | 'sales';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Lead types
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

// Lead filters type
export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: 'latest' | 'oldest';
}

// Form types
export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}
