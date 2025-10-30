import React from 'react';
import styled from 'styled-components';
import OrdersTable, { OrderRow } from '../../components/dashboard/OrdersTable';
import UsersTable, { UserRow } from '../../components/dashboard/UsersTable';
import { FaUsers, FaClipboardList, FaFlask, FaChartLine } from 'react-icons/fa';

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #111827;
`;

const Subtle = styled.div`
  color: #6B7280;
  font-size: 14px;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

const KPICard = styled.div`
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const KPIIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;

const KPIInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const KPILabel = styled.span`
  color: #6B7280;
  font-size: 13px;
`;

const KPIValue = styled.span`
  color: #111827;
  font-weight: 800;
  font-size: 22px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const AdminDashboardPage: React.FC = () => {
  const kpis = [
    { label: 'Tổng người dùng', value: '1,245', icon: <FaUsers /> },
    { label: 'Xét nghiệm hôm nay', value: '212', icon: <FaFlask /> },
    { label: 'Đơn hàng chờ', value: '37', icon: <FaClipboardList /> },
    { label: 'Tăng trưởng', value: '+8.2%', icon: <FaChartLine /> },
  ];

  const orderRows: OrderRow[] = [
    { id: 'ORD-1000', patientName: 'Nguyễn Văn A', patientEmail: 'nguyenvana@email.com', type: 'Máu', status: 'pending', doctor: 'BS. Minh', createdAt: '16/10/2025', dueAt: '16/10/2025' },
    { id: 'ORD-1001', patientName: 'Trần Thị B', patientEmail: 'tranthib@email.com', type: 'Nước tiểu', status: 'inProgress', doctor: 'BS. Lan', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1002', patientName: 'Lê Văn C', patientEmail: 'levanc@email.com', type: 'X quang', status: 'cancelled', doctor: 'BS. Tuấn', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1003', patientName: 'Phạm Thị D', patientEmail: 'phamthid@email.com', type: 'Siêu âm', status: 'cancelled', doctor: 'BS. Minh', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1004', patientName: 'Nguyễn A', patientEmail: 'nguyen.a@email.com', type: 'Máu', status: 'pending', doctor: 'BS. Lan', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1005', patientName: 'Trần Thị B', patientEmail: 'tranthib@email.com', type: 'Nước tiểu', status: 'inProgress', doctor: 'BS. Tuấn', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1006', patientName: 'Lê Văn C', patientEmail: 'levanc@email.com', type: 'X quang', status: 'inProgress', doctor: 'BS. Minh', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1007', patientName: 'Phạm Thị D', patientEmail: 'phamthid@email.com', type: 'Siêu âm', status: 'pending', doctor: 'BS. Tuấn', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1008', patientName: 'Nguyễn Văn A', patientEmail: 'nguyenvana@email.com', type: 'Máu', status: 'pending', doctor: 'BS. Tuấn', createdAt: '16/10/2025', dueAt: '18/10/2025' },
    { id: 'ORD-1009', patientName: 'Trần Thị B', patientEmail: 'tranthib@email.com', type: 'Nước tiểu', status: 'inProgress', doctor: 'BS. Lan', createdAt: '16/10/2025', dueAt: '18/10/2025' },
  ];

  const userRows: UserRow[] = [
    { id: 'U1', name: 'Nguyễn Văn A', email: 'user1@lab.com', role: 'Administrator', status: 'active', activity: 'Đang hóa', createdAt: '2025-10-15 15:09:30', online: true },
    { id: 'U2', name: 'Trần Thị B', email: 'user2@lab.com', role: 'Laboratory Manager', status: 'active', activity: 'Đang hóa', createdAt: '2025-10-15 15:09:30', online: true },
    { id: 'U3', name: 'Lê Văn C', email: 'user3@lab.com', role: 'Service', status: 'suspended', activity: '1 ngày trước\n(Từ 08:15 đến 16:18)', createdAt: '2025-10-15 15:09:30' },
    { id: 'U4', name: 'Phạm Thị D', email: 'user4@lab.com', role: 'Lab User', status: 'active', activity: 'Đang hóa', createdAt: '2025-10-15 15:09:30', online: true },
    { id: 'U5', name: 'Hoàng Văn E', email: 'user5@lab.com', role: 'Laboratory Manager', status: 'active', activity: 'Hoạt động 8 giờ trước\n(Từ 11:11 đến 16:18)', createdAt: '2025-10-15 15:09:30' },
    { id: 'U6', name: 'Vũ Thị F', email: 'user6@lab.com', role: 'Lab User', status: 'active', activity: 'Đang hóa', createdAt: '2025-10-15 15:09:30' },
    { id: 'U7', name: 'Đỗ Văn G', email: 'user7@lab.com', role: 'Service', status: 'pending', activity: '2 giờ trước\n(Từ 13:15 đến 15:30)', createdAt: '2025-10-15 15:09:30' },
    { id: 'U8', name: 'Bùi Thị H', email: 'user8@lab.com', role: 'Lab User', status: 'active', activity: 'Đang hóa', createdAt: '2025-10-15 15:09:30', online: true },
    { id: 'U9', name: 'Lý Văn I', email: 'user9@lab.com', role: 'Administrator', status: 'active', activity: 'Đang hóa', createdAt: '2025-10-15 15:09:30' },
    { id: 'U10', name: 'Trương Thị K', email: 'user10@lab.com', role: 'Lab User', status: 'active', activity: 'Đang hóa', createdAt: '2025-10-15 15:09:30', online: true },
  ];

  return (
    <Container>
      <Header>
        <TitleBlock>
          <PageTitle>Admin Dashboard</PageTitle>
          <Subtle>Hệ thống quản lý phòng xét nghiệm máu (Hematology Lab)</Subtle>
        </TitleBlock>
        <Subtle>
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Subtle>
      </Header>

      <KPIGrid>
        {kpis.map((k, i) => (
          <KPICard key={i}>
            <KPIIcon>{k.icon}</KPIIcon>
            <KPIInfo>
              <KPILabel>{k.label}</KPILabel>
              <KPIValue>{k.value}</KPIValue>
            </KPIInfo>
          </KPICard>
        ))}
      </KPIGrid>

      <SectionGrid>
        <OrdersTable rows={orderRows} />
        <UsersTable rows={userRows} />
      </SectionGrid>
    </Container>
  );
};

export default AdminDashboardPage;
