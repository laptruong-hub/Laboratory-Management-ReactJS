import { apiClient } from "./apiClient";

/* ---------- Types ---------- */
export interface TestOrder {
  id?: number;
  orderNumber?: string;
  patientId: number;
  testType?: string;g
  status?: string;
  orderDate?: string | Date;
  dueDate?: string | Date;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TestOrderDto {
  id: number;
  orderNumber: string;
  patientId: number;
  testType?: string;
  status?: string;
  orderDate?: string;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Test Order API Functions ---------- */

/**
 * Get test order by ID
 * GET /api/test-orders/{id}
 */
export const getTestOrderById = async (id: number): Promise<TestOrderDto> => {
  const response = await apiClient.get(`/api/test-orders/${id}`);
  return response.data;
};

/**
 * Get all test orders
 * GET /api/test-orders
 */
export const getAllTestOrders = async (): Promise<TestOrderDto[]> => {
  const response = await apiClient.get("/api/test-orders");
  return response.data;
};

/**
 * Create a new test order
 * POST /api/test-orders
 */
export const createTestOrder = async (
  testOrder: TestOrder
): Promise<TestOrderDto> => {
  const response = await apiClient.post("/api/test-orders", testOrder);
  return response.data;
};

/**
 * Update test order
 * PUT /api/test-orders/{id}
 */
export const updateTestOrder = async (
  id: number,
  testOrder: Partial<TestOrder>
): Promise<TestOrderDto> => {
  const response = await apiClient.put(`/api/test-orders/${id}`, testOrder);
  return response.data;
};

/**
 * Delete test order
 * DELETE /api/test-orders/{id}
 */
export const deleteTestOrder = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/test-orders/${id}`);
};

/**
 * Get all test orders for a patient
 * GET /api/test-orders/patient/{patientId}
 */
export const getTestOrdersByPatientId = async (
  patientId: number
): Promise<TestOrderDto[]> => {
  const response = await apiClient.get(`/api/test-orders/patient/${patientId}`);
  return response.data;
};

/**
 * Get test order by order number
 * GET /api/test-orders/order-number/{orderNumber}
 */
export const getTestOrderByOrderNumber = async (
  orderNumber: string
): Promise<TestOrderDto> => {
  const response = await apiClient.get(
    `/api/test-orders/order-number/${orderNumber}`
  );
  return response.data;
};