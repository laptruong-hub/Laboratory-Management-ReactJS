import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface OrderDetailResponse {
  orderDetailId: number;
  orderId: number;
  typeTestId: number;
  typeTestName: string;
  totalPrice: number;
}

/* ---------- API Functions ---------- */

/**
 * Get all order details
 * GET /api/order-details
 */
export const getAllOrderDetails = async (): Promise<OrderDetailResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderDetailResponse[]>>(
    "/api/order-details"
  );
  return response.data.data;
};

/**
 * Get order detail by ID
 * GET /api/order-details/{id}
 */
export const getOrderDetailById = async (
  id: number
): Promise<OrderDetailResponse> => {
  const response = await apiClient.get<ApiResponse<OrderDetailResponse>>(
    `/api/order-details/${id}`
  );
  return response.data.data;
};

/**
 * Get order details by order ID
 * GET /api/order-details/order/{orderId}
 */
export const getOrderDetailsByOrderId = async (
  orderId: number
): Promise<OrderDetailResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderDetailResponse[]>>(
    `/api/order-details/order/${orderId}`
  );
  return response.data.data;
};

