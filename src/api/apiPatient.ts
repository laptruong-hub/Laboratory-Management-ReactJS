import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

/**
 * API Response Wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string | null; // Optional, có thể null
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

/**
 * Patient data for creating (Request)
 * Maps to CreatePatientRequest
 */
export interface CreatePatientRequest {
  accountId: number; // Required
  fullName: string; // Required
  email?: string; // Optional, but must be valid email if provided
  phoneNumber?: string;
  address?: string;
  gender?: boolean; // boolean: true = Nam, false = Nữ
  dob?: string | Date; // Format: "YYYY-MM-DD"
}

/**
 * Patient data for updating (Request)
 * Maps to UpdatePatientRequest
 */
export interface UpdatePatientRequest {
  fullName?: string;
  email?: string; // Optional, but must be valid email if provided
  phoneNumber?: string;
  address?: string;
  gender?: boolean; // boolean: true = Nam, false = Nữ
  dob?: string | Date; // Format: "YYYY-MM-DD"
  isActive?: boolean;
}

/**
 * @deprecated Use CreatePatientRequest or UpdatePatientRequest instead
 * Kept for backward compatibility
 */
export interface Patient {
  accountId?: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  dob?: string | Date;
  isActive?: boolean;
}

/**
 * Patient data from API (Response)
 */
export interface PatientDto {
  patientId: number; // Primary key - needed for orders relationship
  accountId: number; // ID của account/user trong bảng users
  fullName: string;
  email: string;
  phone?: string; // API uses "phone" not "phoneNumber"
  address?: string;
  gender?: boolean; // boolean: true = Nam, false = Nữ
  dateOfBirth?: string; // API uses "dateOfBirth" not "dob", Format: "YYYY-MM-DD"
  latestTestDate?: string | null; // Format: "YYYY-MM-DD" or null
  isActive: boolean;
  createdAt?: string; // ISO 8601 format
  createdById?: number | null;
}

/* ---------- Patient API Functions ---------- */

/**
 * Get patient by account ID
 * GET /api/patients/{accountId}
 */
export const getPatientByAccountId = async (accountId: number): Promise<PatientDto> => {
  const response = await apiClient.get<ApiResponse<PatientDto>>(`/api/patients/${accountId}`);
  return response.data.data;
};

/**
 * Get all patients
 * GET /api/patients
 */
export const getAllPatients = async (): Promise<PatientDto[]> => {
  const response = await apiClient.get<ApiResponse<PatientDto[]>>("/api/patients");
  return response.data.data;
};

/**
 * Create a new patient
 * POST /api/patients
 */
export const createPatient = async (request: CreatePatientRequest): Promise<PatientDto> => {
  // Convert dob to string format if it's a Date object
  const patientData = {
    ...request,
    dob: request.dob instanceof Date ? request.dob.toISOString().split("T")[0] : request.dob,
  };

  const response = await apiClient.post<ApiResponse<PatientDto>>("/api/patients", patientData);
  return response.data.data;
};

/**
 * Update patient
 * PUT /api/patients/{accountId}
 */
export const updatePatient = async (accountId: number, request: UpdatePatientRequest): Promise<PatientDto> => {
  // Convert dob to string format if it's a Date object
  const patientData = {
    ...request,
    dob: request.dob instanceof Date ? request.dob.toISOString().split("T")[0] : request.dob,
  };

  const response = await apiClient.put<ApiResponse<PatientDto>>(`/api/patients/${accountId}`, patientData);
  return response.data.data;
};

/**
 * Delete patient
 * DELETE /api/patients/{accountId}
 */
export const deletePatient = async (accountId: number): Promise<void> => {
  await apiClient.delete(`/api/patients/${accountId}`);
  // DELETE returns 204 No Content, no response body
};

/**
 * Get patients from IAM service (sync)
 * GET /api/patients/sync-from-iam
 * This endpoint fetches accounts from iam-service with role="Patient" and merges with patient records
 */
export const getPatientsFromIam = async (): Promise<PatientDto[]> => {
  const response = await apiClient.get<ApiResponse<PatientDto[]>>("/api/patients/sync-from-iam");
  return response.data.data;
};
