import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import {
    getOrdersByStatus,
    approveOrder,
    type OrderResponse,
} from "../../api/apiOrder";
import {
    getOrderDetailsByOrderId,
    type OrderDetailResponse,
} from "../../api/apiOrderDetail";
import LoadingSpinner from "../common/LoadingSpinner";

/* ---------- Styled Components ---------- */

const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  border: 2px solid #fde047;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    border-color: #facc15;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
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

const OrderStatus = styled.span`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background: #fef3c7;
  color: #854d0e;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
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

const OrderDetailsSection = styled.div`
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const OrderDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(p) =>
        p.$variant === "primary"
            ? `
    background: #16a34a;
    color: white;
    &:hover:not(:disabled) {
      background: #15803d;
    }
  `
            : `
    background: #f3f4f6;
    color: #374151;
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 0.75rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

/* ---------- Component ---------- */

const ApproveOrdersTab: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [orderDetailsMap, setOrderDetailsMap] = useState<
        Record<number, OrderDetailResponse[]>
    >({});
    const [approvingOrderId, setApprovingOrderId] = useState<number | null>(null);

    useEffect(() => {
        fetchDraftOrders();
    }, []);

    const fetchDraftOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await getOrdersByStatus("DRAFT");
            setOrders(ordersData);

            // Fetch order details for each order
            const detailsMap: Record<number, OrderDetailResponse[]> = {};
            await Promise.all(
                ordersData.map(async (order) => {
                    try {
                        const details = await getOrderDetailsByOrderId(order.orderId);
                        detailsMap[order.orderId] = details;
                    } catch (error) {
                        detailsMap[order.orderId] = [];
                    }
                })
            );

            setOrderDetailsMap(detailsMap);
        } catch (error: any) {
            console.error("Error fetching draft orders:", error);
            toast.error("Không thể tải danh sách đơn chờ duyệt");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (orderId: number) => {
        try {
            setApprovingOrderId(orderId);
            await approveOrder(orderId);
            toast.success("Duyệt đơn thành công!");

            // Remove order from list
            setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
        } catch (error: any) {
            console.error("Error approving order:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Không thể duyệt đơn. Vui lòng thử lại.";
            toast.error(errorMessage);
        } finally {
            setApprovingOrderId(null);
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            DRAFT: "Chờ duyệt",
            PENDING: "Chờ xử lý",
            PAID: "Đã thanh toán",
            CHECKIN: "Đã check-in",
            CANCEL: "Đã hủy",
            COMPLETE: "Hoàn thành",
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <Container>
                <LoadingSpinner />
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Title>📋 Duyệt Lịch Khám</Title>
                <Subtitle>
                    Xem xét và duyệt các đơn đặt lịch do bệnh nhân tự tạo
                </Subtitle>
            </Header>

            {orders.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>✓</EmptyIcon>
                    <div>Không có đơn nào chờ duyệt</div>
                    <div
                        style={{
                            fontSize: "0.875rem",
                            marginTop: "0.5rem",
                            color: "#9ca3af",
                        }}
                    >
                        Tất cả đơn đặt lịch đã được xử lý
                    </div>
                </EmptyState>
            ) : (
                <OrdersGrid>
                    {orders.map((order) => {
                        const details = orderDetailsMap[order.orderId] || [];
                        const totalAmount = details.reduce(
                            (sum, detail) => sum + detail.totalPrice,
                            0
                        );

                        return (
                            <OrderCard key={order.orderId}>
                                <OrderHeader>
                                    <OrderId>Đơn #{order.orderId}</OrderId>
                                    <OrderStatus>{getStatusText(order.status)}</OrderStatus>
                                </OrderHeader>

                                <OrderInfo>
                                    <OrderInfoRow>
                                        <Label>Bệnh nhân:</Label>
                                        <span>{order.patientName}</span>
                                    </OrderInfoRow>
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

                                {details.length > 0 && (
                                    <OrderDetailsSection>
                                        <Label style={{ display: "block", marginBottom: "0.5rem" }}>
                                            Các xét nghiệm:
                                        </Label>
                                        {details.map((detail) => (
                                            <OrderDetailItem key={detail.orderDetailId}>
                                                <span>{detail.typeTestName}</span>
                                                <span style={{ fontWeight: 600, color: "#dc2626" }}>
                                                    {detail.totalPrice.toLocaleString("vi-VN")} VNĐ
                                                </span>
                                            </OrderDetailItem>
                                        ))}
                                        <div
                                            style={{
                                                marginTop: "0.75rem",
                                                paddingTop: "0.75rem",
                                                borderTop: "2px solid #e5e7eb",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontWeight: 700,
                                            }}
                                        >
                                            <span>Tổng cộng:</span>
                                            <span style={{ color: "#dc2626" }}>
                                                {totalAmount.toLocaleString("vi-VN")} VNĐ
                                            </span>
                                        </div>
                                    </OrderDetailsSection>
                                )}

                                <ButtonGroup>
                                    <Button
                                        $variant="primary"
                                        onClick={() => handleApprove(order.orderId)}
                                        disabled={approvingOrderId === order.orderId}
                                    >
                                        {approvingOrderId === order.orderId
                                            ? "Đang duyệt..."
                                            : "Duyệt đơn"}
                                    </Button>
                                </ButtonGroup>
                            </OrderCard>
                        );
                    })}
                </OrdersGrid>
            )}
        </Container>
    );
};

export default ApproveOrdersTab;

