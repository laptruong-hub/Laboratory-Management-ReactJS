import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Bell, Pencil, AlertTriangle } from "lucide-react";

type OrderStatus = "pending" | "inProgress" | "completed" | "cancelled";

export interface OrderRow {
  id: string;
  patientName: string;
  patientEmail: string;
  type: "Máu" | "Nước tiểu" | "X quang" | "Siêu âm";
  status: OrderStatus;
  doctor: string;
  createdAt: string; // DD/MM/YYYY
  dueAt: string; // DD/MM/YYYY
  overdue?: boolean;
}

interface OrdersTableProps {
  rows: OrderRow[];
}

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? "#dc2626" : "#E5E7EB")};
  background: ${(p) => (p.$active ? "#dc2626" : "#ffffff")};
  color: ${(p) => (p.$active ? "#ffffff" : "#6B7280")};
  cursor: pointer;
`;

const SearchBox = styled.input`
  margin-left: auto;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  width: 220px;
  background: #ffffff;
  color: #111827;

  &:focus {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 1200px;
  min-width: 1200px;
  border-collapse: separate;
  border-spacing: 0;
`;

const Thead = styled.thead`
  background: #f9fafb;
`;

const Th = styled.th`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
`;

const Tr = styled.tr`
  height: 72px;
  background: #ffffff;
  border-bottom: 1px solid #f3f4f6;
  &:hover {
    background: #f9fafb;
  }
`;

const Td = styled.td`
  padding: 16px;
  vertical-align: middle;
  color: #111827;
  font-size: 14px;
`;

const OrderLink = styled.button`
  background: transparent;
  color: #dc2626;
  border: none;
  padding: 0;
  font-weight: 500;
  cursor: pointer;
`;

const PatientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fee2e2;
  color: #b91c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PatientName = styled.span`
  font-weight: 600;
  color: #111827;
`;

const PatientEmail = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ $status: OrderStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  ${(p) =>
    p.$status === "pending"
      ? "background:#FEF3C7;color:#B45309;"
      : p.$status === "inProgress"
      ? "background:#DBEAFE;color:#1D4ED8;"
      : p.$status === "completed"
      ? "background:#D1FAE5;color:#047857;"
      : "background:#FEE2E2;color:#B91C1C;"}
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: inline-block;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px;
  color: #6b7280;
  cursor: pointer;
  display: inline-flex;
  &:hover {
    color: #2563eb;
    border-color: #bfdbfe;
  }
`;

export const OrdersTable: React.FC<OrdersTableProps> = ({ rows }) => {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesFilter = filter === "all" ? true : r.status === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [rows, filter, search]);

  return (
    <Card>
      <Header>
        <TitleRow>
          <Title>Đơn xét nghiệm gần đây</Title>
        </TitleRow>
        <FiltersRow>
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ xử lý" },
            { key: "inProgress", label: "Đang xử lý" },
            { key: "completed", label: "Hoàn thành" },
            { key: "cancelled", label: "Bị hủy" },
          ].map((item) => (
            <TabButton
              key={item.key}
              $active={filter === (item.key as any)}
              onClick={() => setFilter(item.key as any)}
            >
              {item.label}
            </TabButton>
          ))}
          <SearchBox
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FiltersRow>
      </Header>

      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>Mã đơn</Th>
              <Th>Bệnh nhân</Th>
              <Th>Loại</Th>
              <Th>Trạng thái</Th>
              <Th>Bác sĩ</Th>
              <Th>Tạo lúc</Th>
              <Th>Hạn trả</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {filtered.map((r) => (
              <Tr key={r.id}>
                <Td>
                  <OrderLink>{r.id}</OrderLink>
                </Td>
                <Td>
                  <PatientCell>
                    <Avatar>{r.patientName.charAt(0)}</Avatar>
                    <PatientInfo>
                      <PatientName>{r.patientName}</PatientName>
                      <PatientEmail>{r.patientEmail}</PatientEmail>
                    </PatientInfo>
                  </PatientCell>
                </Td>
                <Td>{r.type}</Td>
                <Td>
                  <StatusBadge $status={r.status}>
                    <Dot
                      $color={
                        r.status === "pending"
                          ? "#F59E0B"
                          : r.status === "inProgress"
                          ? "#3B82F6"
                          : r.status === "completed"
                          ? "#10B981"
                          : "#EF4444"
                      }
                    />
                    {r.status === "pending"
                      ? "Chờ xử lý"
                      : r.status === "inProgress"
                      ? "Đang xử lý"
                      : r.status === "completed"
                      ? "Hoàn thành"
                      : "Đã hủy"}
                  </StatusBadge>
                </Td>
                <Td>{r.doctor}</Td>
                <Td style={{ color: "#6B7280" }}>{r.createdAt}</Td>
                <Td
                  style={{
                    color: r.overdue ? "#B91C1C" : "#6B7280",
                    fontWeight: r.overdue ? 600 : 400,
                  }}
                >
                  {r.overdue && (
                    <AlertTriangle
                      size={14}
                      style={{ marginRight: 6, verticalAlign: "text-bottom" }}
                    />
                  )}
                  {r.dueAt}
                </Td>
                <Td>
                  <Actions>
                    <IconButton aria-label="Notify">
                      <Bell size={16} />
                    </IconButton>
                    <IconButton aria-label="Edit">
                      <Pencil size={16} />
                    </IconButton>
                  </Actions>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Card>
  );
};

export default OrdersTable;
