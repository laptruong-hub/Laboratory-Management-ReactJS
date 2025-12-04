import { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getOrdersByPatientId,
  type OrderResponse,
} from "../../api/apiOrder";
import {
  getOrderDetailsByOrderId,
  type OrderDetailResponse,
} from "../../api/apiOrderDetail";
import {
  getTestResultsByOrderDetailId,
  type TestResultResponse,
} from "../../api/apiTestResult";
import { getPatientByAccountId } from "../../api/apiPatient";
import LoadingSpinner from "../common/LoadingSpinner";
import PatientOrderComment from "./PatientOrderComment";

/* ---------- Styled Components ---------- */

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const OrderCard = styled.div<{ $selected?: boolean; $clickable?: boolean }>`
  padding: 1.5rem;
  background: white;
  border: 2px solid ${(p) => (p.$selected ? "#dc2626" : "#e5e7eb")};
  border-radius: 0.75rem;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${(p) => (p.$clickable ? 1 : 0.6)};

  &:hover {
    ${(p) =>
      p.$clickable
        ? `
      border-color: #dc2626;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    `
        : ""}
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const OrderId = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const OrderStatus = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background: ${(p) => {
    switch (p.$status) {
      case "COMPLETE":
        return "#dcfce7";
      case "PENDING":
      case "PAID":
        return "#fef3c7";
      case "DRAFT":
        return "#e5e7eb";
      case "CANCEL":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(p) => {
    switch (p.$status) {
      case "COMPLETE":
        return "#166534";
      case "PENDING":
      case "PAID":
        return "#854d0e";
      case "DRAFT":
        return "#374151";
      case "CANCEL":
        return "#991b1b";
      default:
        return "#6b7280";
    }
  }};
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const OrderInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-weight: 500;
  color: #374151;
`;

const DetailSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TestTypeCard = styled.div<{ $hasResults?: boolean }>`
  padding: 1.5rem;
  background: ${(p) => (p.$hasResults ? "#f0fdf4" : "#fef3c7")};
  border: 2px solid ${(p) => (p.$hasResults ? "#86efac" : "#fde047")};
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
  }
`;

const TestTypeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TestTypeName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const ResultsBadge = styled.span<{ $hasResults?: boolean }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background: ${(p) => (p.$hasResults ? "#16a34a" : "#eab308")};
  color: white;
`;

const TestTypeInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ResultCard = styled.div<{ $status?: "normal" | "abnormal" }>`
  padding: 1rem;
  background: white;
  border: 2px solid
    ${(p) => (p.$status === "abnormal" ? "#f87171" : "#d1fae5")};
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ResultName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const ResultValue = styled.div<{ $status?: "normal" | "abnormal" }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(p) => (p.$status === "abnormal" ? "#dc2626" : "#16a34a")};
  margin-bottom: 0.25rem;
`;

const ResultUnit = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  margin-left: 0.25rem;
`;

const ResultReference = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const StatusIndicator = styled.div<{ $status?: "normal" | "abnormal" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
  background: ${(p) => (p.$status === "abnormal" ? "#fee2e2" : "#dcfce7")};
  color: ${(p) => (p.$status === "abnormal" ? "#991b1b" : "#166534")};
  margin-top: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
  font-size: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2rem 0;
`;

const InfoBanner = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #1e40af;
`;

const InfoIcon = styled.span`
  font-size: 1.5rem;
`;

/* ---------- Component ---------- */

export default function PatientTestResults() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [_patientId, setPatientId] = useState<number | null>(null); // Stored for future use
  const [orders, setOrders] = useState<OrderResponse[]>([]); // Tất cả orders (PENDING + COMPLETE)
  const [totalOrders, setTotalOrders] = useState(0); // Tổng số orders
  const [completedCount, setCompletedCount] = useState(0); // Số đơn COMPLETE
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailResponse[]>([]);
  const [testResultsMap, setTestResultsMap] = useState<
    Record<number, TestResultResponse[]>
  >({});

  useEffect(() => {
    if (user?.id) {
      fetchPatientAndOrders();
    }
  }, [user?.id]);

  const fetchPatientAndOrders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Step 1: Get patient info from account_id (user.id from IAM)
      console.log("🔍 Fetching patient info for account_id:", user.id);
      const patientData = await getPatientByAccountId(user.id);
      console.log("✅ Patient data:", patientData);
      setPatientId(patientData.patientId);

      // Step 2: Fetch orders using patientId
      console.log("🔍 Fetching orders for patient_id:", patientData.patientId);
      const ordersData = await getOrdersByPatientId(patientData.patientId);

      const completedOrders = ordersData.filter(order => order.status === "COMPLETE");
      const pendingOrdersCount = ordersData.length - completedOrders.length;

      console.log(`✅ Orders data: ${ordersData.length} total, ${completedOrders.length} completed, ${pendingOrdersCount} pending`);

      setTotalOrders(ordersData.length);
      setCompletedCount(completedOrders.length);
      setOrders(ordersData); // ✅ Lưu cả PENDING và COMPLETE
    } catch (error: any) {
      console.error("❌ Error fetching patient or orders:", error);
      if (error.response?.status === 404) {
        toast.error("Không tìm thấy thông tin bệnh nhân. Vui lòng liên hệ quản trị viên.");
      } else {
        toast.error("Không thể tải danh sách đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setOrderDetails([]);
    setTestResultsMap({});

    try {
      const details = await getOrderDetailsByOrderId(orderId);
      setOrderDetails(details);

      // Fetch test results for all order details
      const resultsMap: Record<number, TestResultResponse[]> = {};
      await Promise.all(
        details.map(async (detail) => {
          try {
            const results = await getTestResultsByOrderDetailId(
              detail.orderDetailId
            );
            resultsMap[detail.orderDetailId] = results;
          } catch (error) {
            resultsMap[detail.orderDetailId] = [];
          }
        })
      );

      setTestResultsMap(resultsMap);
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      DRAFT: "Nháp",
      PENDING: "Chờ xử lý",
      PAID: "Đã thanh toán",
      CHECKIN: "Đã check-in",
      CANCEL: "Đã hủy",
      COMPLETE: "Hoàn thành",
    };
    return statusMap[status] || status;
  };

  const checkResultStatus = (
    value: number,
    referenceRange?: string
  ): "normal" | "abnormal" => {
    if (!referenceRange) return "normal";

    try {
      // Parse reference range like "0.4-4.0" or "<200" or ">40"
      if (referenceRange.startsWith("<")) {
        const max = parseFloat(referenceRange.substring(1));
        return value < max ? "normal" : "abnormal";
      } else if (referenceRange.startsWith(">")) {
        const min = parseFloat(referenceRange.substring(1));
        return value > min ? "normal" : "abnormal";
      } else if (referenceRange.includes("-")) {
        const [min, max] = referenceRange.split("-").map(parseFloat);
        return value >= min && value <= max ? "normal" : "abnormal";
      }
    } catch (error) {
      console.error("Error parsing reference range:", error);
    }

    return "normal";
  };

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId);

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>📋 Kết Quả Xét Nghiệm</PageTitle>
        <PageSubtitle>
          Xem kết quả xét nghiệm và theo dõi sức khỏe của bạn
        </PageSubtitle>
      </PageHeader>

      {/* Info Banner: Hiển thị nếu có orders đang xử lý */}
      {totalOrders > completedCount && (
        <InfoBanner>
          <InfoIcon>ℹ️</InfoIcon>
          <div>
            <strong>Thông báo:</strong> Bạn có {totalOrders - completedCount} đơn xét nghiệm đang được xử lý.
            Kết quả sẽ hiển thị khi tất cả các xét nghiệm trong đơn đã hoàn thành.
          </div>
        </InfoBanner>
      )}

      {completedCount === 0 ? (
        <EmptyState>
          <EmptyIcon>🔬</EmptyIcon>
          <div>Chưa có kết quả xét nghiệm nào hoàn thành</div>
          <div style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "#9ca3af" }}>
            Kết quả sẽ hiển thị khi tất cả xét nghiệm đã được hoàn thành
          </div>
        </EmptyState>
      ) : (
        <>
          <SectionTitle>Danh Sách Đơn Xét Nghiệm</SectionTitle>
          <OrdersGrid>
            {orders.map((order) => (
              (() => {
                const isCompleted = order.status === "COMPLETE";
                return (
              <OrderCard
                key={order.orderId}
                $selected={selectedOrderId === order.orderId}
                $clickable={isCompleted}
                onClick={isCompleted ? () => handleOrderSelect(order.orderId) : undefined}
              >
                <OrderHeader>
                  <OrderId>Đơn #{order.orderId}</OrderId>
                  <OrderStatus $status={order.status}>
                    {getStatusText(order.status)}
                  </OrderStatus>
                </OrderHeader>
                <OrderInfo>
                  <OrderInfoRow>
                    <Label>Mục đích:</Label>
                    <span>{order.purposeName}</span>
                  </OrderInfoRow>
                  <OrderInfoRow>
                    <Label>Ngày tạo:</Label>
                    <span>
                      {new Date(order.createdDate).toLocaleDateString("vi-VN")}
                    </span>
                  </OrderInfoRow>
                  {order.dateBook && (
                    <OrderInfoRow>
                      <Label>Ngày hẹn:</Label>
                      <span>{order.dateBook}</span>
                    </OrderInfoRow>
                  )}
                </OrderInfo>
                {!isCompleted && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#9ca3af" }}>
                    ⏳ Đơn đang được xử lý - kết quả sẽ hiển thị sau khi hoàn thành.
                  </div>
                )}
              </OrderCard>
                );
              })()
            ))}
          </OrdersGrid>
        </>
      )}

      {selectedOrderId && selectedOrder && (
        <>
          <Divider />
          <DetailSection>
            <SectionTitle>
              🔬 Kết Quả Chi Tiết - Đơn #{selectedOrder.orderId}
            </SectionTitle>

            {orderDetails.length === 0 ? (
              <EmptyState>
                <div>Đơn hàng này chưa có chi tiết xét nghiệm</div>
              </EmptyState>
            ) : (
              orderDetails.map((detail) => {
                const results = testResultsMap[detail.orderDetailId] || [];
                const hasResults = results.length > 0;

                return (
                  <TestTypeCard
                    key={detail.orderDetailId}
                    $hasResults={hasResults}
                  >
                    <TestTypeHeader>
                      <TestTypeName>{detail.typeTestName}</TestTypeName>
                      <ResultsBadge $hasResults={hasResults}>
                        {hasResults
                          ? `✓ Có kết quả (${results.length})`
                          : "⏳ Chưa có kết quả"}
                      </ResultsBadge>
                    </TestTypeHeader>
                    <TestTypeInfo>
                      Giá: {detail.totalPrice.toLocaleString("vi-VN")} VNĐ
                    </TestTypeInfo>

                    {hasResults && (
                      <ResultsGrid>
                        {results.map((result) => {
                          const status = checkResultStatus(
                            result.value,
                            result.unit === "mIU/L"
                              ? "0.4-4.0"
                              : result.unit === "ng/dL"
                                ? "80-200"
                                : undefined
                          );

                          return (
                            <ResultCard
                              key={result.testResultId}
                              $status={status}
                            >
                              <ResultName>{result.testResultName}</ResultName>
                              <ResultValue $status={status}>
                                {result.value}
                                <ResultUnit>{result.unit}</ResultUnit>
                              </ResultValue>
                              <ResultReference>
                                Khoảng tham chiếu: 0.4-4.0 {result.unit}
                              </ResultReference>
                              <StatusIndicator $status={status}>
                                {status === "normal"
                                  ? "✓ Bình thường"
                                  : "⚠ Bất thường"}
                              </StatusIndicator>
                            </ResultCard>
                          );
                        })}
                      </ResultsGrid>
                    )}

                    {/* ✅ Comment Section - Hiển thị comment từ bác sĩ */}
                    <PatientOrderComment orderDetailId={detail.orderDetailId} />
                  </TestTypeCard>
                );
              })
            )}
          </DetailSection>
        </>
      )}
    </Container>
  );
}

