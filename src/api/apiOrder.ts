import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface CreateOrderRequest {
  patientId: number;
  purposeId: number;
  userId?: number;
  note?: string;
  dateBook?: string; // yyyy-MM-dd
  workSlotId?: number;
}

export interface OrderResponse {
  orderId: number;
  patientId: number;
  patientName: string;
  purposeId: number;
  purposeName: string;
  userId?: number;
  createdDate: string;
  status: "DRAFT" | "PENDING" | "PAID" | "CHECKIN" | "CANCEL" | "COMPLETE";
  note?: string;
  dateBook?: string;
  isCheckin: boolean;
  workSlotId?: number;
}

export interface PurposeResponse {
  purposeId: number;
  name: string;
}

/* ---------- API Functions ---------- */

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (
  request: CreateOrderRequest
): Promise<OrderResponse> => {
  const response = await apiClient.post<ApiResponse<OrderResponse>>(
    "/api/orders",
    request
  );
  return response.data.data;
};

/**
 * Get all orders
 * GET /api/orders
 */
export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderResponse[]>>(
    "/api/orders"
  );
  return response.data.data;
};

/**
 * Get order by ID
 * GET /api/orders/{id}
 */
export const getOrderById = async (id: number): Promise<OrderResponse> => {
  const response = await apiClient.get<ApiResponse<OrderResponse>>(
    `/api/orders/${id}`
  );
  return response.data.data;
};

/**
 * Get orders by work slot ID
 * GET /api/orders/work-slot/{workSlotId}
 */
export const getOrdersByWorkSlotId = async (
  workSlotId: number
): Promise<OrderResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderResponse[]>>(
    `/api/orders/work-slot/${workSlotId}`
  );
  return response.data.data;
};

/**
 * Get all purposes
 * GET /api/purposes
 */
export const getAllPurposes = async (): Promise<PurposeResponse[]> => {
  const response = await apiClient.get<ApiResponse<PurposeResponse[]>>(
    "/api/purposes"
  );
  return response.data.data;
};
