import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaList, FaCalendarCheck, FaUsers } from "react-icons/fa";

/* ---------- Styled Components ---------- */

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  flex: 1;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
    border-color: #dc2626;
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: #fee2e2;
  color: #dc2626;
  font-size: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

/* ---------- Component ---------- */

export default function ReceptionistDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Danh sách yêu cầu",
      description: "Xem và quản lý các yêu cầu xét nghiệm từ bệnh nhân",
      icon: <FaList />,
      path: "/receptionist/patient-requests",
    },
    {
      title: "Đặt lịch khám",
      description: "Tạo lịch hẹn xét nghiệm cho bệnh nhân",
      icon: <FaCalendarCheck />,
      path: "/receptionist/schedule-appointment",
    },
    {
      title: "Danh sách bệnh nhân",
      description: "Xem thông tin và quản lý danh sách bệnh nhân",
      icon: <FaUsers />,
      path: "/receptionist/patients",
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Bảng điều khiển</PageTitle>
        <PageDescription>
          Quản lý yêu cầu xét nghiệm và đặt lịch khám cho bệnh nhân
        </PageDescription>
      </PageHeader>

      <CardsGrid>
        {menuItems.map((item) => (
          <Card key={item.path} onClick={() => navigate(item.path)}>
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        ))}
      </CardsGrid>
    </PageContainer>
  );
}

