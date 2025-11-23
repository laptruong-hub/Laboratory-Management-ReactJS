import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

/**
 * API Response Wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

/**
 * Doctor/User response from iam-service
 */
export interface DoctorResponse {
  userId: number;
  email: string;
  fullName: string;
  phone?: string;
  roleName: string;
  isActive: boolean;
}

/**
 * WorkSlot data for creating (Request)
 */
export interface CreateWorkSlotRequest {
  doctorId: number;
  startTime: string; // ISO 8601 format: "2025-11-25T08:00:00"
  endTime: string; // ISO 8601 format: "2025-11-25T12:00:00"
  notes?: string;
}

/**
 * WorkSlot data for updating (Request)
 */
export interface UpdateWorkSlotRequest {
  startTime?: string;
  endTime?: string;
  status?: WorkSlotStatus;
  notes?: string;
  isActive?: boolean;
}

/**
 * WorkSlot Status type
 */
export type WorkSlotStatus = "AVAILABLE" | "BOOKED" | "CANCELLED" | "COMPLETED";

/**
 * WorkSlot Status constants (for backward compatibility)
 */
export const WorkSlotStatusValues = {
  AVAILABLE: "AVAILABLE" as WorkSlotStatus,
  BOOKED: "BOOKED" as WorkSlotStatus,
  CANCELLED: "CANCELLED" as WorkSlotStatus,
  COMPLETED: "COMPLETED" as WorkSlotStatus,
} as const;

/**
 * WorkSlot data from API (Response)
 */
export interface WorkSlotResponse {
  workSlotId: number;
  doctorId: number;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  status: WorkSlotStatus;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: number;
}

/* ---------- WorkSlot API Functions ---------- */

/**
 * Get all available doctors (LAB_USER) from iam-service
 * GET /api/work-slots/doctors?onlyActive=true
 */
export const getAvailableDoctors = async (onlyActive: boolean = true): Promise<DoctorResponse[]> => {
  const response = await apiClient.get<ApiResponse<DoctorResponse[]>>(
    `/api/work-slots/doctors?onlyActive=${onlyActive}`
  );
  return response.data.data;
};

/**
 * Get work slot by ID
 * GET /api/work-slots/{id}
 */
export const getWorkSlotById = async (id: number): Promise<WorkSlotResponse> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse>>(`/api/work-slots/${id}`);
  return response.data.data;
};

/**
 * Get all work slots
 * GET /api/work-slots
 */
export const getAllWorkSlots = async (): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse[]>>("/api/work-slots");
  return response.data.data;
};

/**
 * Get work slots by doctor ID
 * GET /api/work-slots/doctor/{doctorId}
 */
export const getWorkSlotsByDoctorId = async (doctorId: number): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse[]>>(
    `/api/work-slots/doctor/${doctorId}`
  );
  return response.data.data;
};

/**
 * Get work slots by doctor ID and status
 * GET /api/work-slots/doctor/{doctorId}/status/{status}
 */
export const getWorkSlotsByDoctorIdAndStatus = async (
  doctorId: number,
  status: WorkSlotStatus
): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse[]>>(
    `/api/work-slots/doctor/${doctorId}/status/${status}`
  );
  return response.data.data;
};

/**
 * Get available work slots for a doctor
 * GET /api/work-slots/doctor/{doctorId}/available
 */
export const getAvailableWorkSlotsByDoctorId = async (
  doctorId: number
): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<ApiResponse<WorkSlotResponse[]>>(
    `/api/work-slots/doctor/${doctorId}/available`
  );
  return response.data.data;
};

/**
 * Create a new work slot
 * POST /api/work-slots
 */
export const createWorkSlot = async (
  request: CreateWorkSlotRequest
): Promise<WorkSlotResponse> => {
  const response = await apiClient.post<ApiResponse<WorkSlotResponse>>(
    "/api/work-slots",
    request
  );
  return response.data.data;
};

/**
 * Update work slot
 * PUT /api/work-slots/{id}
 */
export const updateWorkSlot = async (
  id: number,
  request: UpdateWorkSlotRequest
): Promise<WorkSlotResponse> => {
  const response = await apiClient.put<ApiResponse<WorkSlotResponse>>(
    `/api/work-slots/${id}`,
    request
  );
  return response.data.data;
};

/**
 * Cancel a work slot
 * PUT /api/work-slots/{id}/cancel
 */
export const cancelWorkSlot = async (id: number): Promise<WorkSlotResponse> => {
  const response = await apiClient.put<ApiResponse<WorkSlotResponse>>(
    `/api/work-slots/${id}/cancel`
  );
  return response.data.data;
};

/**
 * Delete work slot
 * DELETE /api/work-slots/{id}
 */
export const deleteWorkSlot = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/work-slots/${id}`);
};

