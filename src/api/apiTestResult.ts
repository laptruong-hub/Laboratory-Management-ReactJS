import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface CreateTestResultRequest {
  orderDetailId: number;
  labUserId: number;
  typeTestDetailId: number;
  testResultName: string;
  value: number;
  unit?: string;
}

export interface TestResultResponse {
  testResultId: number;
  orderDetailId: number;
  labUserId: number;
  labUserName: string;
  typeTestDetailId: number;
  testResultName: string;
  value: number;
  unit?: string;
  createdAt: string;
  updatedAt: string;
}

/* ---------- API Functions ---------- */

/**
 * Create a new test result
 * POST /api/test-results
 */
export const createTestResult = async (
  request: CreateTestResultRequest
): Promise<TestResultResponse> => {
  const response = await apiClient.post<ApiResponse<TestResultResponse>>(
    "/api/test-results",
    request
  );
  return response.data.data;
};

/**
 * Get all test results
 * GET /api/test-results
 */
export const getAllTestResults = async (): Promise<TestResultResponse[]> => {
  const response = await apiClient.get<ApiResponse<TestResultResponse[]>>(
    "/api/test-results"
  );
  return response.data.data;
};

/**
 * Get test result by ID
 * GET /api/test-results/{id}
 */
export const getTestResultById = async (
  id: number
): Promise<TestResultResponse> => {
  const response = await apiClient.get<ApiResponse<TestResultResponse>>(
    `/api/test-results/${id}`
  );
  return response.data.data;
};

/**
 * Get test results by order detail ID
 * GET /api/test-results/order-detail/{orderDetailId}
 */
export const getTestResultsByOrderDetailId = async (
  orderDetailId: number
): Promise<TestResultResponse[]> => {
  const response = await apiClient.get<ApiResponse<TestResultResponse[]>>(
    `/api/test-results/order-detail/${orderDetailId}`
  );
  return response.data.data;
};

