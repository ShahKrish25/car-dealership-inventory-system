import axiosInstance from './axiosInstance';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/login', payload);
  return response.data;
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/register', payload);
  return response.data;
};
