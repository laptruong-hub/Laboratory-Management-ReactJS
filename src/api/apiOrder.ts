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
  labUserId?: number;
  note?: string;
  dateBook?: string; // yyyy-MM-dd
  workSlotId?: number;
  orderDetails: OrderDetailItem[]; // Danh sách loại xét nghiệm
}

export interface OrderDetailItem {
  typeTestId: number;
  totalPrice: number;
}

export interface OrderResponse {
  orderId: number;
  patientId: number;
  patientName: string;
  purposeId: number;
  purposeName: string;
  labUserId?: number;
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
 * Create a new patient order
 * POST /api/orders/patient
 */
export const createPatientOrder = async (
  request: CreateOrderRequest
): Promise<OrderResponse> => {
  const response = await apiClient.post<ApiResponse<OrderResponse>>(
    "/api/orders/patient",
    request
  );
  return response.data.data;
};

/**
 * Create a new reception order
 * POST /api/orders/reception
 */
export const createReceptionOrder = async (
  request: CreateOrderRequest
): Promise<OrderResponse> => {
  const response = await apiClient.post<ApiResponse<OrderResponse>>(
    "/api/orders/reception",
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
 * Get orders by lab user ID
 * GET /api/orders/lab-user/{labUserId}
 */
export const getOrdersByLabUserId = async (
  labUserId: number
): Promise<OrderResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderResponse[]>>(
    `/api/orders/lab-user/${labUserId}`
  );
  return response.data.data;
};

/**
 * Get orders by patient ID
 */
export const getOrdersByPatientId = async (
  patientId: number
): Promise<OrderResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderResponse[]>>(
    `/api/orders/patient/${patientId}`
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

/**
 * Get orders by status
 * GET /api/orders/status/{status}
 */
export const getOrdersByStatus = async (
  status: string
): Promise<OrderResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderResponse[]>>(
    `/api/orders/status/${status}`
  );
  return response.data.data;
};

/**
 * Approve order (DRAFT → PENDING)
 * POST /api/orders/{id}/approve
 */
export const approveOrder = async (id: number): Promise<OrderResponse> => {
  const response = await apiClient.post<ApiResponse<OrderResponse>>(
    `/api/orders/${id}/approve`
  );
  return response.data.data;
};
