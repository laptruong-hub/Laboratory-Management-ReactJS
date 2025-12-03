import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getWorkSlotsByLabUserId, type WorkSlotResponse } from "../../api/apiWorkSlot";
import { getOrdersByWorkSlotId, type OrderResponse } from "../../api/apiOrder";
import { getOrderDetailsByOrderId, type OrderDetailResponse } from "../../api/apiOrderDetail";
import { getAllTypeTestDetails, type TypeTestDetailResponse } from "../../api/apiTypeTestDetail";
import { createTestResult, type CreateTestResultRequest } from "../../api/apiTestResult";
import LoadingSpinner from "../common/LoadingSpinner";
import OrderCommentSection from "./OrderCommentSection";

/* ---------- Types ---------- */

interface TestResultFormData {
  orderId: string;
  orderDetailId: string;
  typeTestDetailId: string;
  testResultName: string;
  value: string;
  unit: string;
}

/* ---------- Styled Components ---------- */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Select = styled.select`
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const Input = styled.input`
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #dc2626;
  color: white;
  align-self: flex-start;

  &:hover {
    background: #b91c1c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
`;

const OrderCard = styled.div<{ $selected?: boolean }>`
  padding: 0.75rem;
  background: white;
  border: 2px solid ${(p) => (p.$selected ? "#dc2626" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #dc2626;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const OrderCardTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const OrderCardInfo = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const OrderDetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const OrderDetailCard = styled.div<{ $selected?: boolean }>`
  padding: 0.625rem;
  background: white;
  border: 2px solid ${(p) => (p.$selected ? "#10b981" : "#e5e7eb")};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #10b981;
  }
`;

const OrderDetailTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

const OrderDetailInfo = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

/* ---------- Component ---------- */

export default function CreateTestResultForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [workSlots, setWorkSlots] = useState<WorkSlotResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailResponse[]>([]);
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState<number | null>(null);
  const [typeTestDetails, setTypeTestDetails] = useState<TypeTestDetailResponse[]>([]);
  const [filteredTypeTestDetails, setFilteredTypeTestDetails] = useState<TypeTestDetailResponse[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TestResultFormData>();

  const selectedOrderDetailIdForm = watch("orderDetailId");

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
      fetchTypeTestDetails();
    }
  }, [user]);

  useEffect(() => {
    if (selectedOrderDetailIdForm) {
      const orderDetailId = parseInt(selectedOrderDetailIdForm);
      setSelectedOrderDetailId(orderDetailId);
      const selectedDetail = orderDetails.find((od) => od.orderDetailId === orderDetailId);
      if (selectedDetail) {
        // Filter type test details by the order detail's type test
        const filtered = typeTestDetails.filter((ttd) => ttd.typeTestId === selectedDetail.typeTestId);
        setFilteredTypeTestDetails(filtered);
      }
    } else {
      setFilteredTypeTestDetails([]);
    }
  }, [selectedOrderDetailIdForm, orderDetails, typeTestDetails]);

  const fetchOrders = async () => {
    if (!user?.id) return;

    try {
      setLoadingOrders(true);
      // Get work slots for this lab user
      const slots = await getWorkSlotsByLabUserId(user.id);
      setWorkSlots(slots);

      // Get orders for each work slot
      const ordersPromises = slots.map((slot) => getOrdersByWorkSlotId(slot.workSlotId));
      const ordersArrays = await Promise.all(ordersPromises);

      // Flatten and deduplicate orders
      const allOrders = ordersArrays.flat();
      const uniqueOrders = Array.from(new Map(allOrders.map((order) => [order.orderId, order])).values());

      setOrders(uniqueOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchTypeTestDetails = async () => {
    try {
      const data = await getAllTypeTestDetails();
      setTypeTestDetails(data);
    } catch (error: any) {
      console.error("Error fetching type test details:", error);
      toast.error("Không thể tải danh sách chỉ số xét nghiệm");
    }
  };

  const handleOrderSelect = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setSelectedOrderDetailId(null);
    setFilteredTypeTestDetails([]);
    reset({ orderDetailId: "" });

    try {
      const details = await getOrderDetailsByOrderId(orderId);
      setOrderDetails(details);
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const onSubmit = async (data: TestResultFormData) => {
    if (!user?.id || !selectedOrderDetailId) {
      toast.error("Thiếu thông tin cần thiết");
      return;
    }

    try {
      setLoading(true);
      const request: CreateTestResultRequest = {
        orderDetailId: selectedOrderDetailId,
        labUserId: user.id,
        typeTestDetailId: parseInt(data.typeTestDetailId),
        testResultName: data.testResultName,
        value: parseFloat(data.value),
        unit: data.unit || undefined,
      };

      await createTestResult(request);
      toast.success("Tạo kết quả xét nghiệm thành công!");
      reset();
      setSelectedOrderId(null);
      setSelectedOrderDetailId(null);
      setOrderDetails([]);
      setFilteredTypeTestDetails([]);
    } catch (error: any) {
      console.error("Error creating test result:", error);
      const errorMessage = error.response?.data?.message || "Không thể tạo kết quả xét nghiệm";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingOrders) {
    return (
      <LoadingContainer>
        <LoadingSpinner text="Đang tải danh sách đơn hàng..." />
      </LoadingContainer>
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label htmlFor="orderId">
          Chọn đơn hàng <span style={{ color: "#ef4444" }}>*</span>
        </Label>
        {orders.length === 0 ? (
          <div style={{ padding: "1rem", background: "#f9fafb", borderRadius: "0.5rem", color: "#6b7280" }}>
            Không có đơn hàng nào được phân công cho bạn
          </div>
        ) : (
          <OrdersList>
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                $selected={selectedOrderId === order.orderId}
                onClick={() => handleOrderSelect(order.orderId)}
              >
                <OrderCardTitle>
                  Đơn #{order.orderId} - {order.patientName}
                </OrderCardTitle>
                <OrderCardInfo>
                  Mục đích: {order.purposeName} | Ngày đặt: {order.dateBook || "Chưa có"}
                </OrderCardInfo>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </FormGroup>

      {selectedOrderId && orderDetails.length > 0 && (
        <>
          <FormGroup>
            <Label htmlFor="orderDetailId">
              Chọn chi tiết đơn hàng <span style={{ color: "#ef4444" }}>*</span>
            </Label>
            <OrderDetailsList>
              {orderDetails.map((detail) => (
                <OrderDetailCard
                  key={detail.orderDetailId}
                  $selected={selectedOrderDetailId === detail.orderDetailId}
                  onClick={() => {
                    setSelectedOrderDetailId(detail.orderDetailId);
                    reset({ ...watch(), orderDetailId: detail.orderDetailId.toString() });
                  }}
                >
                  <OrderDetailTitle>{detail.typeTestName}</OrderDetailTitle>
                  <OrderDetailInfo>Giá: {detail.totalPrice.toLocaleString("vi-VN")} VNĐ</OrderDetailInfo>
                </OrderDetailCard>
              ))}
            </OrderDetailsList>
            <input
              type="hidden"
              {...register("orderDetailId", {
                required: "Vui lòng chọn chi tiết đơn hàng",
              })}
              value={selectedOrderDetailId || ""}
            />
            {errors.orderDetailId && <ErrorMessage>{errors.orderDetailId.message}</ErrorMessage>}
          </FormGroup>

          {selectedOrderDetailId && (
            <>
              <FormGroup>
                <Label htmlFor="typeTestDetailId">
                  Chỉ số xét nghiệm <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Select
                  id="typeTestDetailId"
                  {...register("typeTestDetailId", {
                    required: "Vui lòng chọn chỉ số xét nghiệm",
                  })}
                >
                  <option value="">-- Chọn chỉ số xét nghiệm --</option>
                  {filteredTypeTestDetails.length === 0 ? (
                    <option disabled>Không có chỉ số xét nghiệm phù hợp</option>
                  ) : (
                    filteredTypeTestDetails.map((detail) => (
                      <option key={detail.typeTestDetailId} value={detail.typeTestDetailId}>
                        {detail.bloodIndicatorCode} - {detail.typeTestName}
                      </option>
                    ))
                  )}
                </Select>
                {errors.typeTestDetailId && <ErrorMessage>{errors.typeTestDetailId.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="testResultName">
                  Tên kết quả <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  id="testResultName"
                  type="text"
                  {...register("testResultName", {
                    required: "Vui lòng nhập tên kết quả",
                  })}
                  placeholder="Nhập tên kết quả xét nghiệm"
                />
                {errors.testResultName && <ErrorMessage>{errors.testResultName.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="value">
                  Giá trị <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  {...register("value", {
                    required: "Vui lòng nhập giá trị",
                    min: { value: 0, message: "Giá trị phải lớn hơn hoặc bằng 0" },
                  })}
                  placeholder="Nhập giá trị kết quả"
                />
                {errors.value && <ErrorMessage>{errors.value.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="unit">Đơn vị</Label>
                <Input id="unit" type="text" {...register("unit")} placeholder="Nhập đơn vị (ví dụ: g/L, mmol/L)" />
              </FormGroup>

              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Tạo kết quả xét nghiệm"}
              </Button>

              {/* Order Comments Section */}
              <OrderCommentSection orderDetailId={selectedOrderDetailId} />
            </>
          )}
        </>
      )}
    </Form>
  );
}
