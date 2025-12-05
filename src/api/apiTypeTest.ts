import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface TypeTestResponse {
  typeTestId: number;
  typeName: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/* ---------- API Functions ---------- */

/**
 * Get all active type tests
 * GET /api/type-tests
 */
export const getAllActiveTypeTests = async (): Promise<TypeTestResponse[]> => {
  const response = await apiClient.get<ApiResponse<TypeTestResponse[]>>(
    "/api/type-tests"
  );
  return response.data.data;
};

/**
 * Get all type tests (including inactive)
 * GET /api/type-tests/all
 */
export const getAllTypeTests = async (): Promise<TypeTestResponse[]> => {
  const response = await apiClient.get<ApiResponse<TypeTestResponse[]>>(
    "/api/type-tests/all"
  );
  return response.data.data;
};

/**
 * Get type test by ID
 * GET /api/type-tests/{id}
 */
export const getTypeTestById = async (
  id: number
): Promise<TypeTestResponse> => {
  const response = await apiClient.get<ApiResponse<TypeTestResponse>>(
    `/api/type-tests/${id}`
  );
  return response.data.data;
};

