import { apiClient } from "./apiClient";

/* ---------- Types ---------- */

interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  timestamp?: string | null;
  error?: string | null;
}

export interface OrderCommentResponse {
  orderCommentId: number;
  orderDetailId: number;
  labUserId: number;
  labUserName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderCommentRequest {
  orderDetailId: number;
  labUserId: number;
  content: string;
}

export interface UpdateOrderCommentRequest {
  content: string;
}

/* ---------- API Functions ---------- */

/**
 * Create a new order comment
 * POST /api/order-comments
 */
export const createOrderComment = async (
  request: CreateOrderCommentRequest
): Promise<OrderCommentResponse> => {
  const response = await apiClient.post<ApiResponse<OrderCommentResponse>>(
    "/api/order-comments",
    request
  );
  return response.data.data;
};

/**
 * Get all order comments
 * GET /api/order-comments
 */
export const getAllOrderComments = async (): Promise<OrderCommentResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderCommentResponse[]>>(
    "/api/order-comments"
  );
  return response.data.data;
};

/**
 * Get order comment by ID
 * GET /api/order-comments/{id}
 */
export const getOrderCommentById = async (
  id: number
): Promise<OrderCommentResponse> => {
  const response = await apiClient.get<ApiResponse<OrderCommentResponse>>(
    `/api/order-comments/${id}`
  );
  return response.data.data;
};

/**
 * Get order comments by order detail ID
 * GET /api/order-comments/order-detail/{orderDetailId}
 */
export const getOrderCommentsByOrderDetailId = async (
  orderDetailId: number
): Promise<OrderCommentResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderCommentResponse[]>>(
    `/api/order-comments/order-detail/${orderDetailId}`
  );
  return response.data.data;
};

/**
 * Get order comments by lab user ID
 * GET /api/order-comments/lab-user/{labUserId}
 */
export const getOrderCommentsByLabUserId = async (
  labUserId: number
): Promise<OrderCommentResponse[]> => {
  const response = await apiClient.get<ApiResponse<OrderCommentResponse[]>>(
    `/api/order-comments/lab-user/${labUserId}`
  );
  return response.data.data;
};

/**
 * Update order comment
 * PUT /api/order-comments/{id}
 */
export const updateOrderComment = async (
  id: number,
  request: UpdateOrderCommentRequest
): Promise<OrderCommentResponse> => {
  const response = await apiClient.put<ApiResponse<OrderCommentResponse>>(
    `/api/order-comments/${id}`,
    request
  );
  return response.data.data;
};

/**
 * Delete order comment
 * DELETE /api/order-comments/{id}
 */
export const deleteOrderComment = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/order-comments/${id}`);
};

