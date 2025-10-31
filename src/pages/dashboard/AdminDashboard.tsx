import React from 'react';
import styled from 'styled-components';
import { FaUsers, FaFlask, FaClipboardList, FaChartLine } from 'react-icons/fa';

const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const Breadcrumb = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid ${props => props.$color};
`;

const StatIcon = styled.div<{ $bgColor: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: ${props => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
`;

const WelcomeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.95;
`;

const DashboardPage: React.FC = () => {
  const stats = [
    {
      label: 'Tổng người dùng',
      value: '156',
      icon: <FaUsers />,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      label: 'Xét nghiệm hôm nay',
      value: '48',
      icon: <FaFlask />,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      label: 'Đơn hàng chờ',
      value: '23',
      icon: <FaClipboardList />,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      label: 'Tăng trưởng',
      value: '+12%',
      icon: <FaChartLine />,
      color: '#dc2626',
      bgColor: '#fee2e2'
    }
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <Breadcrumb>Tổng quan hệ thống</Breadcrumb>
      </PageHeader>

      <WelcomeCard>
        <WelcomeTitle>Chào mừng trở lại!</WelcomeTitle>
        <WelcomeText>
          Đây là trang tổng quan quản lý phòng thí nghiệm. Bạn có thể theo dõi các chỉ số quan trọng và quản lý hệ thống từ đây.
        </WelcomeText>
      </WelcomeCard>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} $color={stat.color}>
            <StatIcon $bgColor={stat.color}>
              {stat.icon}
            </StatIcon>
            <StatInfo>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>
    </PageContainer>
  );
};

export default DashboardPage;
