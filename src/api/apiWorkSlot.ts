import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface DoctorResponse {
  userId: number;
  email: string;
  fullName: string;
  phone?: string;
  roleName: string;
  isActive: boolean;
}

export interface WorkSessionResponse {
  workSessionId: number;
  workSession: string;
  isActive: boolean;
}

export interface CreateWorkSlotRequest {
  labUserId: number;
  workSessionId: number;
  date: string; // yyyy-MM-dd
  quantity?: number;
}

export interface UpdateWorkSlotRequest {
  labUserId?: number;
  workSessionId?: number;
  date?: string;
  quantity?: number;
  isActive?: boolean;
}

export interface WorkSlotResponse {
  workSlotId: number;
  workSessionId: number;
  workSessionName: string;
  labUserId: number;
  labUserName: string;
  date: string;
  quantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ---------- API helpers ---------- */

export const getAvailableDoctors = async (onlyActive = true): Promise<DoctorResponse[]> => {
  const response = await apiClient.get<ApiResponse<DoctorResponse[]>>(
    `/api/work-slots/doctors?onlyActive=${onlyActive}`
  );
  return response.data.data;
};

export const getWorkSessions = async (): Promise<WorkSessionResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSessionResponse[]>>("/api/work-slots/work-sessions");
  return response.data.data;
};

export const getAllWorkSlots = async (): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse[]>>("/api/work-slots");
  return response.data.data;
};

export const getWorkSlotsByLabUserId = async (
  labUserId: number
): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse[]>>(
    `/api/work-slots/lab-user/${labUserId}`
  );
  return response.data.data;
};

export const getWorkSlotsByLabUserAndDate = async (
  labUserId: number,
  date: string
): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse[]>>(
    `/api/work-slots/lab-user/${labUserId}/date/${date}`
  );
  return response.data.data;
};

export const createWorkSlot = async (
  request: CreateWorkSlotRequest
): Promise<WorkSlotResponse> => {
  const response = await apiClient.post<ApiResponse<WorkSlotResponse>>("/api/work-slots", request);
  return response.data.data;
};

export const updateWorkSlot = async (
  id: number,
  request: UpdateWorkSlotRequest
): Promise<WorkSlotResponse> => {
  const response = await apiClient.put<ApiResponse<WorkSlotResponse>>(`/api/work-slots/${id}`, request);
  return response.data.data;
};

export const deleteWorkSlot = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/work-slots/${id}`);
};
