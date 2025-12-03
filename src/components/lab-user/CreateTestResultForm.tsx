import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getOrdersByLabUserId,
  type OrderResponse,
} from "../../api/apiOrder";
import {
  getOrderDetailsByOrderId,
  type OrderDetailResponse,
} from "../../api/apiOrderDetail";
import {
  getAllTypeTestDetails,
  type TypeTestDetailResponse,
} from "../../api/apiTypeTestDetail";
import {
  createTestResult,
  type CreateTestResultRequest,
} from "../../api/apiTestResult";
import LoadingSpinner from "../common/LoadingSpinner";

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

const SelectedOrderInfo = styled.div`
  padding: 1rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  opacity: 0.9;
`;

const InfoValue = styled.span`
  font-weight: 400;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 20px;
    background: #dc2626;
    border-radius: 2px;
  }
`;

const StepIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.5rem 0;
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  font-style: italic;
`;

const Badge = styled.span<{ $type?: 'success' | 'warning' | 'info' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
  background: ${p => {
    switch (p.$type) {
      case 'success': return '#dcfce7';
      case 'warning': return '#fef3c7';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${p => {
    switch (p.$type) {
      case 'success': return '#166534';
      case 'warning': return '#854d0e';
      case 'info': return '#1e40af';
      default: return '#374151';
    }
  }};
`;

/* ---------- Component ---------- */

export default function CreateTestResultForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
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
        const filtered = typeTestDetails.filter(
          (ttd) => ttd.typeTestId === selectedDetail.typeTestId
        );
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
      // Get orders directly by lab user ID
      const ordersData = await getOrdersByLabUserId(user.id);
      setOrders(ordersData);
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
      const errorMessage =
        error.response?.data?.message || "Không thể tạo kết quả xét nghiệm";
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

  const selectedOrder = orders.find(o => o.orderId === selectedOrderId);
  const selectedDetail = orderDetails.find(od => od.orderDetailId === selectedOrderDetailId);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <SectionTitle>
        <StepIndicator>1</StepIndicator>
        Chọn đơn hàng
        {orders.length > 0 && (
          <Badge $type="info" style={{ marginLeft: 'auto', fontSize: '0.875rem' }}>
            {orders.length} đơn hàng
          </Badge>
        )}
      </SectionTitle>
      <FormGroup>
        {orders.length === 0 ? (
          <div style={{ 
            padding: "2rem", 
            background: "#f9fafb", 
            borderRadius: "0.5rem", 
            color: "#6b7280",
            textAlign: "center",
            border: "2px dashed #d1d5db"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
            <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
              Không có đơn hàng nào
            </div>
            <div style={{ fontSize: "0.875rem" }}>
              Hiện tại chưa có đơn hàng nào được phân công cho bạn
            </div>
          </div>
        ) : (
          <>
            <HelperText style={{ marginBottom: '0.75rem' }}>
              Click vào đơn hàng để xem chi tiết và nhập kết quả xét nghiệm
            </HelperText>
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
                  <Badge $type="info">{order.status}</Badge>
                  {" | "}
                  Mục đích: {order.purposeName}
                  {" | "}
                  Ngày đặt: {order.dateBook || "Chưa có"}
                  {order.isCheckin && <Badge $type="success" style={{ marginLeft: '0.5rem' }}>Đã check-in</Badge>}
                </OrderCardInfo>
              </OrderCard>
            ))}
            </OrdersList>
          </>
        )}
      </FormGroup>

      {selectedOrderId && selectedOrder && (
        <>
          <SelectedOrderInfo>
            <InfoRow>
              <InfoLabel>Bệnh nhân:</InfoLabel>
              <InfoValue>{selectedOrder.patientName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Mã đơn:</InfoLabel>
              <InfoValue>#{selectedOrder.orderId}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Mục đích:</InfoLabel>
              <InfoValue>{selectedOrder.purposeName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Ngày tạo:</InfoLabel>
              <InfoValue>{new Date(selectedOrder.createdDate).toLocaleString('vi-VN')}</InfoValue>
            </InfoRow>
            {selectedOrder.dateBook && (
              <InfoRow>
                <InfoLabel>Ngày hẹn:</InfoLabel>
                <InfoValue>{selectedOrder.dateBook}</InfoValue>
              </InfoRow>
            )}
            {selectedOrder.note && (
              <InfoRow>
                <InfoLabel>Ghi chú:</InfoLabel>
                <InfoValue>{selectedOrder.note}</InfoValue>
              </InfoRow>
            )}
          </SelectedOrderInfo>

          <Divider />
        </>
      )}

      {selectedOrderId && (
        <>
          {orderDetails.length === 0 ? (
            <div style={{ 
              padding: "1.5rem", 
              background: "#fef3c7", 
              borderRadius: "0.5rem", 
              color: "#92400e",
              textAlign: "center",
              border: "2px solid #fbbf24"
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚠️</div>
              <div style={{ fontWeight: "500" }}>
                Đơn hàng này chưa có chi tiết xét nghiệm
              </div>
            </div>
          ) : (
            <>
              <SectionTitle>
                <StepIndicator>2</StepIndicator>
                Chọn loại xét nghiệm
                <Badge $type="success" style={{ marginLeft: 'auto', fontSize: '0.875rem' }}>
                  {orderDetails.length} loại xét nghiệm
                </Badge>
              </SectionTitle>
              <FormGroup>
                <HelperText>
                  Chọn loại xét nghiệm mà bạn muốn nhập kết quả
                </HelperText>
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
                  <OrderDetailInfo>
                    Mã chi tiết: #{detail.orderDetailId} | Giá: {detail.totalPrice.toLocaleString("vi-VN")} VNĐ
                  </OrderDetailInfo>
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
                {errors.orderDetailId && (
                  <ErrorMessage>{errors.orderDetailId.message}</ErrorMessage>
                )}
              </FormGroup>
            </>
          )}
        </>
      )}

      {selectedOrderDetailId && selectedDetail && (
            <>
              <Divider />
              
              <div style={{ 
                padding: '1rem', 
                background: '#f0fdf4', 
                border: '2px solid #86efac', 
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
                  ✓ Đã chọn: {selectedDetail.typeTestName}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                  Mã chi tiết: #{selectedDetail.orderDetailId} | 
                  Giá: {selectedDetail.totalPrice.toLocaleString("vi-VN")} VNĐ
                </div>
              </div>

              <SectionTitle>
                <StepIndicator>3</StepIndicator>
                Nhập kết quả xét nghiệm
              </SectionTitle>

              <FormGroup>
                <Label htmlFor="typeTestDetailId">
                  Chỉ số xét nghiệm <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <HelperText>
                  Chọn chỉ số cụ thể cần nhập kết quả (ví dụ: WBC, RBC, HGB...)
                </HelperText>
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
                      <option
                        key={detail.typeTestDetailId}
                        value={detail.typeTestDetailId}
                      >
                        {detail.bloodIndicatorCode} - {detail.typeTestName}
                      </option>
                    ))
                  )}
                </Select>
                {errors.typeTestDetailId && (
                  <ErrorMessage>{errors.typeTestDetailId.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="testResultName">
                  Tên kết quả <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <HelperText>
                  Nhập tên mô tả cho kết quả xét nghiệm này
                </HelperText>
                <Input
                  id="testResultName"
                  type="text"
                  {...register("testResultName", {
                    required: "Vui lòng nhập tên kết quả",
                  })}
                  placeholder="Ví dụ: Số lượng bạch cầu"
                />
                {errors.testResultName && (
                  <ErrorMessage>{errors.testResultName.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="value">
                  Giá trị đo được <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <HelperText>
                  Nhập giá trị số đo được từ thiết bị xét nghiệm
                </HelperText>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  {...register("value", {
                    required: "Vui lòng nhập giá trị",
                    min: { value: 0, message: "Giá trị phải lớn hơn hoặc bằng 0" },
                  })}
                  placeholder="Ví dụ: 7.5"
                />
                {errors.value && (
                  <ErrorMessage>{errors.value.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="unit">
                  Đơn vị đo <Badge $type="info">Tùy chọn</Badge>
                </Label>
                <HelperText>
                  Đơn vị đo lường của giá trị (sẽ tự động lấy từ hệ thống nếu để trống)
                </HelperText>
                <Input
                  id="unit"
                  type="text"
                  {...register("unit")}
                  placeholder="Ví dụ: 10^3/μL, g/L, mmol/L"
                />
              </FormGroup>

              <Divider />

              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "✓ Hoàn thành và lưu kết quả"}
              </Button>
            </>
          )}
    </Form>
  );
}

