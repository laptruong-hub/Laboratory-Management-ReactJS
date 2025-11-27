import { apiClient, apiPublic } from "./apiClient";

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
 * Patient Request data for creating (Request)
 */
export interface CreatePatientRequestRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  notes?: string;
  patientId?: number;
}

/**
 * Patient Request data from API (Response)
 */
export interface PatientRequestDto {
  patientRequestId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  notes?: string;
  status: "PENDING" | "ACTIVE" | "REJECT";
  patientId?: number;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Patient Request API Functions ---------- */

/**
 * Create a new patient request (public - no auth required)
 * POST /api/patient-requests
 */
export const createPatientRequest = async (
  request: CreatePatientRequestRequest
): Promise<PatientRequestDto> => {
  const response = await apiPublic.post<ApiResponse<PatientRequestDto>>(
    "/api/patient-requests",
    request
  );
  return response.data.data;
};

/**
 * Get all patient requests
 * GET /api/patient-requests
 */
export const getAllPatientRequests = async (): Promise<PatientRequestDto[]> => {
  const response = await apiClient.get<ApiResponse<PatientRequestDto[]>>(
    "/api/patient-requests"
  );
  return response.data.data;
};

/**
 * Get patient request by ID
 * GET /api/patient-requests/{id}
 */
export const getPatientRequestById = async (
  id: number
): Promise<PatientRequestDto> => {
  const response = await apiClient.get<ApiResponse<PatientRequestDto>>(
    `/api/patient-requests/${id}`
  );
  return response.data.data;
};

/**
 * Get patient requests by status
 * GET /api/patient-requests/status/{status}
 */
export const getPatientRequestsByStatus = async (
  status: "PENDING" | "ACTIVE" | "REJECT"
): Promise<PatientRequestDto[]> => {
  const response = await apiClient.get<ApiResponse<PatientRequestDto[]>>(
    `/api/patient-requests/status/${status}`
  );
  return response.data.data;
};

/**
 * Approve patient request (creates account in iam-service)
 * POST /api/patient-requests/{id}/approve
 */
export const approvePatientRequest = async (
  id: number
): Promise<PatientRequestDto> => {
  const response = await apiClient.post<ApiResponse<PatientRequestDto>>(
    `/api/patient-requests/${id}/approve`
  );
  return response.data.data;
};

/**
 * Reject patient request
 * POST /api/patient-requests/{id}/reject
 */
export const rejectPatientRequest = async (
  id: number
): Promise<PatientRequestDto> => {
  const response = await apiClient.post<ApiResponse<PatientRequestDto>>(
    `/api/patient-requests/${id}/reject`
  );
  return response.data.data;
};

/**
 * Delete patient request
 * DELETE /api/patient-requests/{id}
 */
export const deletePatientRequest = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/patient-requests/${id}`);
};


