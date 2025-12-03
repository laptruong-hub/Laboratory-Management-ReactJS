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
  getTypeTestDetailsByTypeTestId,
  type TypeTestDetailResponse,
} from "../../api/apiTypeTestDetail";
import {
  bulkCreateTestResults,
  getTestResultsByOrderDetailId,
  type BulkCreateTestResultRequest,
  type TestResultResponse,
} from "../../api/apiTestResult";
import { getLabUserByUserId } from "../../api/apiLabUser";
import LoadingSpinner from "../common/LoadingSpinner";

/* ---------- Types ---------- */

interface TestResultFormInput {
  [key: string]: string; // Dynamic keys for each type test detail
}

/* ---------- Styled Components ---------- */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const TestResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TestResultCard = styled.div`
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TestResultHeader = styled.div`
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f3f4f6;
`;

const TestResultTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const TestResultMeta = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const Input = styled.input`
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #dc2626;
  color: white;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background: #b91c1c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.5rem 0;
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

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

/* ---------- Component ---------- */

export default function BulkTestResultForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [labUserId, setLabUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailResponse[]>([]);
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState<number | null>(null);
  const [typeTestDetails, setTypeTestDetails] = useState<TypeTestDetailResponse[]>([]);
  const [existingResults, setExistingResults] = useState<TestResultResponse[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TestResultFormInput>();

  useEffect(() => {
    if (user?.id) {
      fetchLabUserAndOrders();
    }
  }, [user]);

  const fetchLabUserAndOrders = async () => {
    if (!user?.id) return;

    try {
      setLoadingOrders(true);
      
      // Step 1: Get lab_user_id from user_id (IAM service ID)
      const labUserData = await getLabUserByUserId(user.id);
      setLabUserId(labUserData.labUserId);
      
      // Step 2: Fetch orders using lab_user_id
      const ordersData = await getOrdersByLabUserId(labUserData.labUserId);
      setOrders(ordersData);
      
      console.log(`✅ Loaded orders for lab_user_id: ${labUserData.labUserId} (user_id: ${user.id})`);
    } catch (error: any) {
      console.error("Error fetching lab user or orders:", error);
      if (error.response?.status === 404) {
        toast.error("Không tìm thấy thông tin Lab User. Vui lòng liên hệ quản trị viên.");
      } else {
        toast.error("Không thể tải danh sách đơn hàng");
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOrderSelect = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setSelectedOrderDetailId(null);
    setTypeTestDetails([]);
    reset();

    try {
      const details = await getOrderDetailsByOrderId(orderId);
      setOrderDetails(details);
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const handleOrderDetailSelect = async (orderDetailId: number, typeTestId: number) => {
    setSelectedOrderDetailId(orderDetailId);
    setExistingResults([]);
    reset();

    try {
      // Fetch both type test details and existing results
      const [details, results] = await Promise.all([
        getTypeTestDetailsByTypeTestId(typeTestId),
        getTestResultsByOrderDetailId(orderDetailId)
      ]);
      
      setTypeTestDetails(details);
      setExistingResults(results);
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} existing test results for order detail ${orderDetailId}`);
      } else {
        console.log(`ℹ️ No existing test results for order detail ${orderDetailId}`);
      }
    } catch (error: any) {
      console.error("Error fetching test details or results:", error);
      toast.error("Không thể tải danh sách chỉ số xét nghiệm");
    }
  };

  const onSubmit = async (data: TestResultFormInput) => {
    if (!labUserId || !selectedOrderDetailId) {
      toast.error("Thiếu thông tin cần thiết");
      return;
    }

    // Build test results array from form data
    const testResults = typeTestDetails.map((detail) => {
      const value = data[`value_${detail.typeTestDetailId}`];
      return {
        typeTestDetailId: detail.typeTestDetailId,
        testResultName: detail.bloodIndicatorName,
        value: parseFloat(value),
        unit: detail.unit, // Will be ignored by backend, but included for reference
      };
    }).filter(item => !isNaN(item.value)); // Only include filled values

    if (testResults.length === 0) {
      toast.error("Vui lòng nhập ít nhất một kết quả xét nghiệm");
      return;
    }

    try {
      setLoading(true);
      const request: BulkCreateTestResultRequest = {
        orderDetailId: selectedOrderDetailId,
        labUserId: labUserId, // Use lab_user_id from TestOrder service, not user.id from IAM
        testResults,
      };

      const createdResults = await bulkCreateTestResults(request);
      toast.success(`Đã tạo ${testResults.length} kết quả xét nghiệm thành công!`);
      
      // Reload existing results to display what was just created
      setExistingResults(createdResults);
      
      // Reset form but keep selection to show results
      reset();
    } catch (error: any) {
      console.error("Error creating test results:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể tạo kết quả xét nghiệm";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedOrder = orders.find(o => o.orderId === selectedOrderId);
  const selectedDetail = orderDetails.find(od => od.orderDetailId === selectedOrderDetailId);

  if (loadingOrders) {
    return (
      <LoadingContainer>
        <LoadingSpinner text="Đang tải danh sách đơn hàng..." />
      </LoadingContainer>
    );
  }

  return (
    <Container>
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
                    Chọn loại xét nghiệm để hiển thị form nhập kết quả đầy đủ
                  </HelperText>
                  <OrderDetailsList>
                    {orderDetails.map((detail) => (
                      <OrderDetailCard
                        key={detail.orderDetailId}
                        $selected={selectedOrderDetailId === detail.orderDetailId}
                        onClick={() => handleOrderDetailSelect(detail.orderDetailId, detail.typeTestId)}
                      >
                        <OrderDetailTitle>{detail.typeTestName}</OrderDetailTitle>
                        <OrderDetailInfo>
                          Mã chi tiết: #{detail.orderDetailId} | Giá: {detail.totalPrice.toLocaleString("vi-VN")} VNĐ
                        </OrderDetailInfo>
                      </OrderDetailCard>
                    ))}
                  </OrderDetailsList>
                </FormGroup>
              </>
            )}
          </>
        )}

        {selectedOrderDetailId && selectedDetail && typeTestDetails.length > 0 && (
          <>
            <Divider />
            
            {/* Display existing results if found */}
            {existingResults.length > 0 ? (
              <div style={{ 
                padding: '1.5rem', 
                background: '#dbeafe', 
                border: '2px solid #3b82f6', 
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '1rem', fontSize: '1.125rem' }}>
                  ✅ Đã nhập kết quả xét nghiệm: {selectedDetail.typeTestName}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#1e3a8a', marginBottom: '1rem' }}>
                  Tổng {existingResults.length} kết quả • Ngày nhập: {new Date(existingResults[0]?.createdAt || '').toLocaleString('vi-VN')}
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                  gap: '0.75rem',
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '0.375rem'
                }}>
                  {existingResults.map((result) => (
                    <div 
                      key={result.testResultId}
                      style={{
                        padding: '0.75rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                        {result.testResultName}
                      </div>
                      <div style={{ fontSize: '1.25rem', color: '#dc2626', fontWeight: '700', marginBottom: '0.25rem' }}>
                        {result.value} <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{result.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: '#fef3c7', 
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  color: '#78350f'
                }}>
                  ℹ️ <strong>Lưu ý:</strong> Kết quả đã được nhập. Nếu cần chỉnh sửa, vui lòng liên hệ quản trị viên.
                </div>
              </div>
            ) : (
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
                  Nhập kết quả cho {typeTestDetails.length} chỉ số xét nghiệm
                </div>
              </div>
            )}

            {/* Only show input form if no existing results */}
            {existingResults.length === 0 && (
              <>
                <SectionTitle>
                  <StepIndicator>3</StepIndicator>
                  Nhập kết quả xét nghiệm
                  <Badge $type="warning" style={{ marginLeft: 'auto', fontSize: '0.875rem' }}>
                    {typeTestDetails.length} chỉ số
                  </Badge>
                </SectionTitle>

                <HelperText>
                  Nhập giá trị đo được cho từng chỉ số. Đơn vị sẽ tự động được lấy từ hệ thống.
                </HelperText>

                <TestResultsGrid>
              {typeTestDetails.map((detail) => (
                <TestResultCard key={detail.typeTestDetailId}>
                  <TestResultHeader>
                    <TestResultTitle>
                      {detail.bloodIndicatorCode} - {detail.bloodIndicatorName}
                    </TestResultTitle>
                    <TestResultMeta>
                      Đơn vị: <strong>{detail.unit}</strong>
                      {detail.referenceRange && (
                        <> | Khoảng tham chiếu: <strong>{detail.referenceRange}</strong></>
                      )}
                    </TestResultMeta>
                  </TestResultHeader>
                  <FormGroup>
                    <Label htmlFor={`value_${detail.typeTestDetailId}`}>
                      Giá trị đo được
                    </Label>
                    <Input
                      id={`value_${detail.typeTestDetailId}`}
                      type="number"
                      step="0.01"
                      placeholder={`Nhập giá trị (${detail.unit})`}
                      {...register(`value_${detail.typeTestDetailId}`, {
                        required: "Vui lòng nhập giá trị",
                        min: { value: 0, message: "Giá trị phải >= 0" },
                      })}
                    />
                    {errors[`value_${detail.typeTestDetailId}`] && (
                      <ErrorMessage>
                        {errors[`value_${detail.typeTestDetailId}`]?.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                </TestResultCard>
              ))}
            </TestResultsGrid>

            <Divider />

            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : `✓ Lưu ${typeTestDetails.length} kết quả xét nghiệm`}
            </Button>
              </>
            )}
          </>
        )}
      </Form>
    </Container>
  );
}

