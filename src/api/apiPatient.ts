import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

/**
 * API Response Wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  error?: string;
}

/**
 * Patient data for creating/updating (Request)
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
  accountId: number; // ID của account/user trong bảng users
  fullName: string;
  email: string;
  phoneNumber?: string; // API sử dụng phoneNumber
  address?: string;
  gender?: string; // API sử dụng string ("Nam", "Nữ")
  dob?: string; // Format: "YYYY-MM-DD"
  latestTestDate?: string; // Format: "YYYY-MM-DD"
  isActive: boolean;
  createdAt?: string; // ISO 8601 format
  createdById?: number;
}

/* ---------- Patient API Functions ---------- */

/**
 * Get patient by account ID
 * GET /api/patients/{accountId}
 */
export const getPatientByAccountId = async (
  accountId: number
): Promise<PatientDto> => {
  const response = await apiClient.get<ApiResponse<PatientDto>>(
    `/api/patients/${accountId}`
  );
  return response.data.data;
};

/**
 * Get all patients
 * GET /api/patients
 */
export const getAllPatients = async (): Promise<PatientDto[]> => {
  const response = await apiClient.get<ApiResponse<PatientDto[]>>(
    "/api/patients"
  );
  return response.data.data;
};

/**
 * Create a new patient
 * POST /api/patients
 */
export const createPatient = async (
  patient: Patient
): Promise<PatientDto> => {
  // Convert dob to string format if it's a Date object
  const patientData = {
    ...patient,
    dob:
      patient.dob instanceof Date
        ? patient.dob.toISOString().split("T")[0]
        : patient.dob,
  };

  const response = await apiClient.post<ApiResponse<PatientDto>>(
    "/api/patients",
    patientData
  );
  return response.data.data;
};

/**
 * Update patient
 * PUT /api/patients/{accountId}
 */
export const updatePatient = async (
  accountId: number,
  patient: Partial<Patient>
): Promise<PatientDto> => {
  // Convert dob to string format if it's a Date object
  const patientData = {
    ...patient,
    dob:
      patient.dob instanceof Date
        ? patient.dob.toISOString().split("T")[0]
        : patient.dob,
  };

  const response = await apiClient.put<ApiResponse<PatientDto>>(
    `/api/patients/${accountId}`,
    patientData
  );
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

