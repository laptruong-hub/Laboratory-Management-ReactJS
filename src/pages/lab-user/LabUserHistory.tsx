import { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import {
  getOrdersByLabUserId,
  exportOrderToExcel,
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
import { getLabUserByUserId } from "../../api/apiLabUser";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OrderCommentSection from "../../components/lab-user/OrderCommentSection";

/* ---------- Styled Components ---------- */

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 0;
  overflow: hidden; /* Chỉ scroll vùng nội dung, không scroll toàn body */
  box-sizing: border-box;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
  gap: 1.5rem;
  align-items: flex-start;
  min-height: 0;
  flex: 1; /* Chiếm toàn bộ chiều cao còn lại */
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1; /* Co giãn theo chiều cao card */
  min-height: 0;
  overflow-y: auto; /* Scroll nội dung bên trong */
`;

const OrderItem = styled.div<{ $selected?: boolean }>`
  padding: 0.75rem 0.9rem;
  background: white;
  border-radius: 0.6rem;
  border: 2px solid ${(p) => (p.$selected ? "#16a34a" : "#e5e7eb")};
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: #16a34a;
    box-shadow: 0 2px 4px rgba(22, 163, 74, 0.15);
    transform: translateY(-1px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const OrderId = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
`;

const OrderDate = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const OrderMeta = styled.div`
  font-size: 0.8rem;
  color: #4b5563;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const Tag = styled.span`
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: #ecfdf3;
  color: #166534;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const DetailHeader = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

const DetailSummary = styled.div`
  font-size: 0.85rem;
  color: #4b5563;
`;

const ExportButton = styled.button`
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #dc2626;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OrderDetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const DetailCard = styled.div`
  padding: 0.9rem 1rem;
  border-radius: 0.65rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const DetailTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const DetailMeta = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.35rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

const ResultCard = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
`;

const ResultName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ResultValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
`;

const ResultUnit = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
  margin-left: 0.25rem;
`;

const HelperText = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
`;

/* ---------- Component ---------- */

export default function LabUserHistory() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [labUserId, setLabUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailResponse[]>([]);
  const [testResultsMap, setTestResultsMap] = useState<
    Record<number, TestResultResponse[]>
  >({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      void fetchLabUserAndOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchLabUserAndOrders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Step 1: map IAM user -> lab_user_id
      const labUser = await getLabUserByUserId(user.id);
      setLabUserId(labUser.labUserId);

      // Step 2: load ALL orders of this lab user, then filter COMPLETE
      const allOrders = await getOrdersByLabUserId(labUser.labUserId);
      const completedOrders = allOrders.filter(
        (o) => o.status === "COMPLETE"
      );

      setOrders(completedOrders);

      if (completedOrders.length === 0) {
        setSelectedOrderId(null);
        setOrderDetails([]);
      }
    } catch (error: any) {
      console.error("Error fetching lab user history:", error);
      const message =
        error.response?.data?.message ||
        "Không thể tải lịch sử khám. Vui lòng thử lại.";
      toast.error(message);
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

       // Load test results for each order detail (read-only view)
       const resultsByDetail: Record<number, TestResultResponse[]> = {};
       await Promise.all(
         details.map(async (detail) => {
           try {
             const results = await getTestResultsByOrderDetailId(
               detail.orderDetailId
             );
             resultsByDetail[detail.orderDetailId] = results;
           } catch (_error) {
             resultsByDetail[detail.orderDetailId] = [];
           }
         })
       );

       setTestResultsMap(resultsByDetail);
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId);

  const handleExportExcel = async () => {
    if (!selectedOrder) return;

    try {
      setExporting(true);
      const blob = await exportOrderToExcel(selectedOrder.orderId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = `ket-qua-don-${selectedOrder.orderId}.xlsx`;
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Đã xuất file Excel cho đơn #${selectedOrder.orderId}`);
    } catch (error: any) {
      console.error("Error exporting order to Excel:", error);
      const message =
        error.response?.data?.message || "Không thể xuất file Excel cho đơn này";
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner text="Đang tải lịch sử khám..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Lịch sử đã khám</PageTitle>
        <PageDescription>
          Xem lại các đơn xét nghiệm đã hoàn thành và chỉnh sửa phần bình luận
        </PageDescription>
      </PageHeader>

      <ContentLayout>
        <Card>
          <CardTitle>Đơn xét nghiệm đã hoàn thành</CardTitle>
          {orders.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
              <div>Chưa có đơn xét nghiệm nào ở trạng thái COMPLETE</div>
            </EmptyState>
          ) : (
            <>
              <HelperText>
                Chọn một đơn xét nghiệm để xem chi tiết và chỉnh sửa bình luận.
              </HelperText>
              <OrdersList>
                {orders.map((order) => (
                  <OrderItem
                    key={order.orderId}
                    $selected={order.orderId === selectedOrderId}
                    onClick={() => handleOrderSelect(order.orderId)}
                  >
                    <OrderHeader>
                      <OrderId>Đơn #{order.orderId}</OrderId>
                      <OrderDate>
                        {new Date(order.createdDate).toLocaleString("vi-VN")}
                      </OrderDate>
                    </OrderHeader>
                    <OrderMeta>
                      <Tag>COMPLETE</Tag>
                      <span>Mục đích: {order.purposeName}</span>
                    </OrderMeta>
                  </OrderItem>
                ))}
              </OrdersList>
            </>
          )}
        </Card>

        <Card>
          <CardTitle>Chi tiết & Bình luận</CardTitle>

          {!selectedOrder || orderDetails.length === 0 ? (
            <EmptyState>
              {orders.length === 0 ? (
                <>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    ℹ️
                  </div>
                  <div>
                    Khi có đơn COMPLETE, bạn có thể chỉnh sửa bình luận tại đây.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    👈
                  </div>
                  <div>Chọn một đơn ở bên trái để xem và chỉnh sửa bình luận</div>
                </>
              )}
            </EmptyState>
          ) : (
            <>
              <DetailHeader>
                <div>
                  <DetailSummary>
                    Đơn #{selectedOrder.orderId} • {selectedOrder.purposeName}
                  </DetailSummary>
                  {selectedOrder.dateBook && (
                    <DetailSummary>
                      Ngày hẹn: {selectedOrder.dateBook}
                    </DetailSummary>
                  )}
                </div>
                <ExportButton
                  type="button"
                  disabled={exporting || !selectedOrder || selectedOrder.status !== "COMPLETE"}
                  onClick={handleExportExcel}
                >
                  {exporting ? "Đang xuất..." : "⬇ Xuất Excel"}
                </ExportButton>
              </DetailHeader>

              <OrderDetailsList>
                {orderDetails.map((detail) => (
                  <DetailCard key={detail.orderDetailId}>
                    <DetailTitle>{detail.typeTestName}</DetailTitle>
                    <DetailMeta>
                      Mã chi tiết: #{detail.orderDetailId} • Giá:{" "}
                      {detail.totalPrice.toLocaleString("vi-VN")} VNĐ
                    </DetailMeta>
                    <HelperText>
                      Bạn chỉ có thể chỉnh sửa phần bình luận cho từng loại xét
                      nghiệm. Kết quả xét nghiệm hiển thị bên dưới ở chế độ chỉ đọc.
                    </HelperText>

                    {/* Kết quả xét nghiệm (read-only) */}
                    {testResultsMap[detail.orderDetailId] &&
                      testResultsMap[detail.orderDetailId].length > 0 && (
                        <ResultsGrid>
                          {testResultsMap[detail.orderDetailId].map((result) => (
                            <ResultCard key={result.testResultId}>
                              <ResultName>{result.testResultName}</ResultName>
                              <ResultValue>
                                {result.value}
                                <ResultUnit>{result.unit}</ResultUnit>
                              </ResultValue>
                            </ResultCard>
                          ))}
                        </ResultsGrid>
                      )}

                    {labUserId && (
                      <OrderCommentSection
                        orderDetailId={detail.orderDetailId}
                        labUserId={labUserId}
                      />
                    )}
                  </DetailCard>
                ))}
              </OrderDetailsList>
            </>
          )}
        </Card>
      </ContentLayout>
    </PageContainer>
  );
}


