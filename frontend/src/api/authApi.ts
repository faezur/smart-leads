import axiosInstance from './axiosInstance';
import type{ ApiResponse, IUser, LoginCredentials, RegisterCredentials } from '../types';

interface AuthData {
  user: IUser;
  token: string;
}

// Register new user
export const registerApi = async (
  credentials: RegisterCredentials
): Promise<ApiResponse<AuthData>> => {
  const response = await axiosInstance.post('/auth/register', credentials);
  return response.data;
};

// Login user
export const loginApi = async (
  credentials: LoginCredentials
): Promise<ApiResponse<AuthData>> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

// Get current logged in user
export const getMeApi = async (): Promise<ApiResponse<{ user: IUser }>> => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};