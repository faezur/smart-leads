import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─────────────────────────────────────────
// USER TYPES
// ─────────────────────────────────────────

export type UserRole = 'admin' | 'sales';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─────────────────────────────────────────
// LEAD TYPES
// ─────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

export interface ILeadDocument extends ILead, Document {
  _id: Types.ObjectId;
}

// ─────────────────────────────────────────
// AUTH TYPES
// ─────────────────────────────────────────

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

// ─────────────────────────────────────────
// REQUEST TYPES — JWT user attach karne ke liye
// ─────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

// ─────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─────────────────────────────────────────
// LEAD QUERY TYPES — filtering ke liye
// ─────────────────────────────────────────

export interface LeadQuery {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
}