import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import OrdersTable, { type OrderRow } from "../../components/dashboard/OrdersTable";
import UsersTable, { type UserRow } from "../../components/dashboard/UsersTable";
import { FaUsers, FaClipboardList, FaFlask, FaChartLine } from "react-icons/fa";
import StatCard from "../../components/dashboard/DashboardCards/StatCard";
import MiniBarChart from "../../components/dashboard/DashboardCards/MiniBarChart";
import Trend from "../../components/dashboard/Charts/TrendChart";
import {
  dashboardStats,
  trendData,
  parameterDistribution,
  roleDistribution,
  heatmapData,
  mockOrderRows,
  mockUserRows,
} from "../../utils/mockData";
import HorizontalBarChart from "../../components/dashboard/Charts/HorizontalBarChart";
import DonutChart from "../../components/dashboard/Charts/DonutChart";
import HeatmapCalendar from "../../components/dashboard/Charts/HeatmapCalendar";
import TopBarActions from "../../components/dashboard/TopBar/TopBarActions";
import { apiClient } from "../../api/apiClient";

const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #94a3b8;

  strong {
    color: #475569;
    font-weight: 600;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #cbd5f5;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
`;

const PageDescription = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
`;

const ActionsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
`;

const SectionSubtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
`;

const KPIGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const AnalyticsGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const TablesGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
`;

const StateCard = styled.div<{ $variant?: "info" | "error" }>`
  background: #ffffff;
  border: 1px solid ${(p) => (p.$variant === "error" ? "#fecaca" : "#e2e8f0")};
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  color: ${(p) => (p.$variant === "error" ? "#b91c1c" : "#475569")};
  min-height: 160px;
`;

interface UserDtoFromApi {
  id: number;
  fullName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  [key: string]: any;
}

interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
}

const ROLE_NAME_MAP: Record<string, UserRow["role"]> = {
  Administrator: "Administrator",
  Admin: "Administrator",
  "Laboratory Manager": "Laboratory Manager",
  "Lab Manager": "Laboratory Manager",
  Service: "Service",
  "Customer Service": "Service",
  "Lab User": "Lab User",
  Technician: "Lab User",
};

const normalizeRoleName = (roleName: string): UserRow["role"] => ROLE_NAME_MAP[roleName] ?? "Lab User";

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    totalUsers: 0,
    totalRoles: 0,
  });
  const [userRows, setUserRows] = useState<UserRow[]>([]);
  const [orderRows] = useState<OrderRow[]>(mockOrderRows.map((order) => ({ ...order })));

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, rolesResponse] = await Promise.all([
        apiClient.get("/api/users"),
        apiClient.get("/api/roles"),
      ]);

      const usersData: UserDtoFromApi[] = usersResponse.data;
      const rolesData = rolesResponse.data;

      const convertedUserRows: UserRow[] = usersData.slice(0, 10).map((user) => ({
        id: user.id.toString(),
        name: user.fullName,
        email: user.email,
        role: normalizeRoleName(user.roleName),
        status: user.isActive ? "active" : "pending",
        activity: user.isActive ? "Đang hoạt động" : "Chưa kích hoạt",
        createdAt: user.createdAt,
        online: user.isActive,
      }));

      setUserRows(convertedUserRows);
      setDashboardData({
        totalUsers: usersData.length,
        totalRoles: rolesData.length,
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Lỗi khi fetch dashboard data:", err);
      }
      setError("Không thể tải dữ liệu dashboard");
      setUserRows(
        mockUserRows.slice(0, 10).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: normalizeRoleName(user.role),
          status: user.status,
          activity: user.activity,
          createdAt: user.createdAt,
          online: user.online ?? false,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = useCallback(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  // Update dashboardStats with real data
  const updatedDashboardStats = {
    ...dashboardStats,
    totalUsers: {
      ...dashboardStats.totalUsers,
      value: dashboardData.totalUsers || dashboardStats.totalUsers.value,
    },
  };

  const header = (
    <PageHeader>
      <HeadingRow>
        <ActionsWrap>
          <TopBarActions onRefresh={handleRefresh} />
        </ActionsWrap>
      </HeadingRow>
    </PageHeader>
  );

  if (loading) {
    return (
      <PageContainer>
        {header}
        <StateCard>
          <strong>Đang tải dữ liệu...</strong>
          <span>Vui lòng đợi trong giây lát.</span>
        </StateCard>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        {header}
        <StateCard $variant="error">
          <strong>{error}</strong>
          <span>Vui lòng thử lại sau hoặc làm mới trang.</span>
        </StateCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {header}

      <Section>
        <SectionHeader>
          <SectionTitle>Chỉ số vận hành</SectionTitle>
          <SectionSubtitle>Tổng quan nhanh các chỉ số chính của hệ thống</SectionSubtitle>
        </SectionHeader>

        <KPIGrid>
          <StatCard
            title={updatedDashboardStats.totalUsers.title}
            value={updatedDashboardStats.totalUsers.value}
            icon={<FaUsers />}
            color="#dc2626"
            description={updatedDashboardStats.totalUsers.description}
          />
          <StatCard
            title={dashboardStats.todayTests.title}
            value={dashboardStats.todayTests.value}
            icon={<FaFlask />}
            color="#dc2626"
          >
            <MiniBarChart data={dashboardStats.todayTests.breakdown} />
          </StatCard>
        </KPIGrid>
      </Section>

      <Section>
        <AnalyticsGrid>
          <HorizontalBarChart title={parameterDistribution.title} data={parameterDistribution.data} />
          <DonutChart
            title={roleDistribution.title}
            totalLabel="Tổng tài khoản"
            total={roleDistribution.total}
            data={roleDistribution.data}
          />
          <HeatmapCalendar title="Heatmap lịch hẹn" month={heatmapData.month} data={heatmapData.data} />
        </AnalyticsGrid>
      </Section>
    </PageContainer>
  );
};

export default AdminDashboardPage;
