import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface TypeTestDetailResponse {
  typeTestDetailId: number;
  typeTestId: number;
  typeTestName: string;
  bloodIndicatorId: number;
  bloodIndicatorCode: string;
}

/* ---------- API Functions ---------- */

/**
 * Get all type test details
 * GET /api/type-test-details
 */
export const getAllTypeTestDetails = async (): Promise<
  TypeTestDetailResponse[]
> => {
  const response = await apiClient.get<ApiResponse<TypeTestDetailResponse[]>>(
    "/api/type-test-details"
  );
  return response.data.data;
};

/**
 * Get type test detail by ID
 * GET /api/type-test-details/{id}
 */
export const getTypeTestDetailById = async (
  id: number
): Promise<TypeTestDetailResponse> => {
  const response = await apiClient.get<ApiResponse<TypeTestDetailResponse>>(
    `/api/type-test-details/${id}`
  );
  return response.data.data;
};

/**
 * Get type test details by type test ID
 * GET /api/type-test-details/type-test/{typeTestId}
 */
export const getTypeTestDetailsByTypeTestId = async (
  typeTestId: number
): Promise<TypeTestDetailResponse[]> => {
  const response = await apiClient.get<ApiResponse<TypeTestDetailResponse[]>>(
    `/api/type-test-details/type-test/${typeTestId}`
  );
  return response.data.data;
};

