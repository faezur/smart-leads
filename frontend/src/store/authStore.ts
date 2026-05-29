import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser, LoginCredentials, RegisterCredentials } from '../types';
import { loginApi, registerApi, getMeApi } from '../api/authApi';
import { getApiErrorMessage } from '../utils/helpers';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginApi(credentials);
          const { user, token } = response.data!;

          // Save token to localStorage
          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = getApiErrorMessage(error, 'Login failed');
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Register action
      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await registerApi(credentials);
          const { user, token } = response.data!;

          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = getApiErrorMessage(error, 'Registration failed');
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Get current user
      getMe: async () => {
        set({ isLoading: true });
        try {
          const response = await getMeApi();
          set({
            user: response.data?.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
