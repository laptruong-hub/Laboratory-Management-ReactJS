import { apiClient } from "./apiClient";

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface LabUserResponse {
  labUserId: number;
  userId: number;
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Get lab user by lab_user_id
 */
export const getLabUserById = async (
  labUserId: number
): Promise<LabUserResponse> => {
  const response = await apiClient.get<ApiResponse<LabUserResponse>>(
    `/api/lab-users/${labUserId}`
  );
  return response.data.data;
};

/**
 * Get lab user by user_id (IAM service ID)
 * This is the key API to convert user.id -> lab_user_id
 */
export const getLabUserByUserId = async (
  userId: number
): Promise<LabUserResponse> => {
  const response = await apiClient.get<ApiResponse<LabUserResponse>>(
    `/api/lab-users/user/${userId}`
  );
  return response.data.data;
};

/**
 * Get all active lab users
 */
export const getAllActiveLabUsers = async (): Promise<LabUserResponse[]> => {
  const response = await apiClient.get<ApiResponse<LabUserResponse[]>>(
    "/api/lab-users/active"
  );
  return response.data.data;
};

/**
 * Get all lab users
 */
export const getAllLabUsers = async (): Promise<LabUserResponse[]> => {
  const response = await apiClient.get<ApiResponse<LabUserResponse[]>>(
    "/api/lab-users"
  );
  return response.data.data;
};

