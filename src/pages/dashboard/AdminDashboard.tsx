import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { FaUsers, FaFlask } from "react-icons/fa";
import StatCard from "../../components/dashboard/DashboardCards/StatCard";
import MiniBarChart from "../../components/dashboard/DashboardCards/MiniBarChart";
import HorizontalBarChart from "../../components/dashboard/Charts/HorizontalBarChart";
import DonutChart from "../../components/dashboard/Charts/DonutChart";
import TopBarActions from "../../components/dashboard/TopBar/TopBarActions";
import { apiClient } from "../../api/apiClient";
import type {
  BreakdownItem,
  ParameterItem,
  RoleSlice,
  HeatmapCell,
} from "../../utils/mockData";
import { getAllOrders, type OrderResponse } from "../../api/apiOrder";
import { getAllPatients, type PatientDto } from "../../api/apiPatient";
import { getAllLabUsers, type LabUserResponse } from "../../api/apiLabUser";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #fef2f2, #f9fafb 42%, #eff6ff);
  padding: 1.5rem 0 2.5rem;
`;

const Inner = styled.div`
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 0.75rem;
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
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111827;
`;

const PageDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
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
  gap: 14px;
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
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
`;

const AnalyticsGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const SummaryCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SummaryTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const SummaryBig = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #dc2626;
`;

const SummaryMuted = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #374151;
`;

const ProgressRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #4b5563;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #f3f4f6;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $w: number; $c?: string }>`
  height: 100%;
  width: ${(p) => Math.min(100, Math.max(0, p.$w))}%;
  background: ${(p) => p.$c ?? "linear-gradient(90deg, #f97316 0%, #dc2626 100%)"};
  transition: width 300ms ease-out;
`;

const TablesGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
`;

const StateCard = styled.div<{ $variant?: "info" | "error" }>`
  background: #ffffff;
  border: 1px solid ${(p) => (p.$variant === "error" ? "#fecaca" : "#e2e8f0")};
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  color: ${(p) => (p.$variant === "error" ? "#b91c1c" : "#475569")};
  min-height: 180px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
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
  totalPatients: number;
  totalOrders: number;
  totalLabUsers: number;
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

const ROLE_COLORS: Record<UserRow["role"], string> = {
  Administrator: "#52C41A",
  "Laboratory Manager": "#1890FF",
  "Lab User": "#FAAD14",
  Service: "#F5222D",
};

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    totalUsers: 0,
    totalRoles: 0,
    totalPatients: 0,
    totalOrders: 0,
    totalLabUsers: 0,
  });
  const [userRows, setUserRows] = useState<UserRow[]>([]);
  const [todayBreakdown, setTodayBreakdown] = useState<BreakdownItem[]>([]);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [roleSlices, setRoleSlices] = useState<RoleSlice[]>([]);
  const [parameterData, setParameterData] = useState<ParameterItem[]>([]);
  const [heatmapMonth, setHeatmapMonth] = useState<string>("");
  const [heatmapCells, setHeatmapCells] = useState<HeatmapCell[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, rolesResponse, patients, labUsers, orders] =
        await Promise.all([
          apiClient.get("/api/users"),
          apiClient.get("/api/roles"),
          getAllPatients(),
          getAllLabUsers(),
          getAllOrders(),
        ]);

      const usersData: UserDtoFromApi[] = usersResponse.data;
      const rolesData = rolesResponse.data as any[];

      // Map users to table rows
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

      // --- KPI numbers ---
      setDashboardData({
        totalUsers: usersData.length,
        totalRoles: rolesData.length,
        totalPatients: (patients as PatientDto[]).length,
        totalOrders: (orders as OrderResponse[]).length,
        totalLabUsers: (labUsers as LabUserResponse[]).length,
      });

      // --- Role distribution for donut chart ---
      const roleCountMap = usersData.reduce<Record<UserRow["role"], number>>(
        (acc, user) => {
          const r = normalizeRoleName(user.roleName);
          acc[r] = (acc[r] || 0) + 1;
          return acc;
        },
        {} as Record<UserRow["role"], number>
      );

      const totalUserCount = usersData.length || 1;
      const roleSlicesData: RoleSlice[] = (
        Object.entries(roleCountMap) as [UserRow["role"], number][]
      ).map(([role, count]) => ({
        role,
        count,
        percent: parseFloat(((count * 100) / totalUserCount).toFixed(1)),
        color: ROLE_COLORS[role] ?? "#dc2626",
      }));
      setRoleSlices(roleSlicesData);

      // --- Orders stats: today breakdown & purposes ---
      const ordersData = orders as OrderResponse[];

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const ordersToday = ordersData.filter((o) => {
        const d = new Date(o.createdDate).toISOString().split("T")[0];
        return d === todayStr;
      });
      const pendingStatuses = new Set< OrderResponse["status"]>(["DRAFT", "PENDING"]);
      const processingStatuses = new Set<OrderResponse["status"]>(["PAID", "CHECKIN"]);
      const completedStatuses = new Set<OrderResponse["status"]>(["COMPLETE"]);

      let waiting = 0;
      let processing = 0;
      let completed = 0;
      ordersToday.forEach((o) => {
        if (pendingStatuses.has(o.status)) waiting++;
        else if (processingStatuses.has(o.status)) processing++;
        else if (completedStatuses.has(o.status)) completed++;
      });

      const totalToday = ordersToday.length || 1;
      const breakdown: BreakdownItem[] = [
        {
          label: "Chờ xử lý",
          value: waiting,
          percent: (waiting * 100) / totalToday,
          color: "#FAAD14",
        },
        {
          label: "Đang xử lý",
          value: processing,
          percent: (processing * 100) / totalToday,
          color: "#1890FF",
        },
        {
          label: "Hoàn thành",
          value: completed,
          percent: (completed * 100) / totalToday,
          color: "#52C41A",
        },
      ];
      setTodayOrderCount(ordersToday.length);
      setTodayBreakdown(breakdown);

      // --- Orders by purpose for horizontal bar chart ---
      const purposeCountMap: Record<string, number> = {};
      ordersData.forEach((o) => {
        if (!o.purposeName) return;
        purposeCountMap[o.purposeName] = (purposeCountMap[o.purposeName] || 0) + 1;
      });
      const totalPurposes = Object.values(purposeCountMap).reduce(
        (sum, v) => sum + v,
        0
      );
      const parameterItems: ParameterItem[] = Object.entries(purposeCountMap).map(
        ([name, count]) => ({
          name,
          count,
          percent:
            totalPurposes > 0
              ? parseFloat(((count * 100) / totalPurposes).toFixed(1))
              : 0,
        })
      );
      setParameterData(parameterItems);

      // --- Heatmap data from orders.dateBook / createdDate ---
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-based
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const countByDay: Record<number, number> = {};
      ordersData.forEach((o) => {
        const src = o.dateBook ?? o.createdDate;
        const d = new Date(src);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const day = d.getDate();
          countByDay[day] = (countByDay[day] || 0) + 1;
        }
      });

      const cells: HeatmapCell[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const jsDate = new Date(year, month, day);
        cells.push({
          date: day,
          day: jsDate.getDay(),
          count: countByDay[day] || 0,
          intensity: countByDay[day] || 0,
        });
      }
      setHeatmapMonth(`Tháng ${month + 1}, ${year}`);
      setHeatmapCells(cells);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Lỗi khi fetch dashboard data:", err);
      }
      setError("Không thể tải dữ liệu dashboard");
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

  const header = (
    <PageHeader>
      <HeadingRow>
        <TitleGroup>
          <PageTitle>Bảng điều khiển hệ thống</PageTitle>
          <PageDescription>
            Theo dõi nhanh người dùng, bệnh nhân và hoạt động xét nghiệm trong ngày
          </PageDescription>
        </TitleGroup>
        <ActionsWrap>
          <TopBarActions onRefresh={handleRefresh} />
        </ActionsWrap>
      </HeadingRow>
    </PageHeader>
  );

  if (loading) {
    return (
      <PageContainer>
        <Inner>
          {header}
          <StateCard>
            <strong>Đang tải dữ liệu...</strong>
            <span>Vui lòng đợi trong giây lát.</span>
          </StateCard>
        </Inner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Inner>
          {header}
          <StateCard $variant="error">
            <strong>{error}</strong>
            <span>Vui lòng thử lại sau hoặc làm mới trang.</span>
          </StateCard>
        </Inner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Inner>
        {header}

        <Section>
          <SectionHeader>
            <SectionTitle>Chỉ số vận hành</SectionTitle>
            <SectionSubtitle>
              Tổng quan nhanh các chỉ số chính của hệ thống
            </SectionSubtitle>
          </SectionHeader>

          <KPIGrid>
            <StatCard
              title="Tổng người dùng"
              value={dashboardData.totalUsers}
              icon={<FaUsers />}
              color="#dc2626"
              description="Số tài khoản đang hoạt động trong hệ thống IAM"
            />
            <StatCard
              title="Đơn xét nghiệm hôm nay"
              value={todayOrderCount}
              icon={<FaFlask />}
              color="#dc2626"
            >
              <MiniBarChart data={todayBreakdown} />
            </StatCard>
            <StatCard
              title="Tổng bệnh nhân"
              value={dashboardData.totalPatients}
              icon={<FaUsers />}
              color="#4b5563"
              description="Số bệnh nhân đã được đồng bộ từ IAM và TestOrder"
            />
            <StatCard
              title="Tổng đơn xét nghiệm"
              value={dashboardData.totalOrders}
              icon={<FaFlask />}
              color="#16a34a"
              description={`Trong đó có ${dashboardData.totalLabUsers} nhân viên xét nghiệm phụ trách`}
            />
          </KPIGrid>
        </Section>

        <Section>
          <AnalyticsGrid>
            {parameterData.length > 0 && (
              <HorizontalBarChart
                title="Phân bố đơn xét nghiệm theo mục đích"
                data={parameterData}
              />
            )}
            <DonutChart
              title="Phân bố tài khoản theo vai trò"
              totalLabel="Tổng tài khoản"
              total={dashboardData.totalUsers}
              data={roleSlices}
            />
            <SummaryCard>
              <SummaryTitle>Lịch hẹn theo ngày — {heatmapMonth}</SummaryTitle>
              {(() => {
                const total = heatmapCells.reduce((s, c) => s + c.count, 0);
                const daysInMonth = heatmapCells.length || 1;
                const maxCell = heatmapCells.reduce(
                  (max, c) => (c.count > max.count ? c : max),
                  { date: 0, day: 0, count: 0, intensity: 0 }
                );
                const busiestCount = maxCell.count;
                const busiestDay = maxCell.date;
                const avgPerDay = total / daysInMonth;
                const monthlyTarget = Math.max(30, total); // tạm đặt mục tiêu = max(30, tổng)

                return (
                  <>
                    <SummaryBig>
                      {total}{" "}
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#6b7280",
                        }}
                      >
                        đơn trong tháng
                      </span>
                    </SummaryBig>
                    <SummaryMuted>
                      Thống kê dựa trên ngày hẹn (dateBook) hoặc ngày tạo đơn nếu
                      chưa có lịch.
                    </SummaryMuted>

                    <SummaryList>
                      <li>
                        <ProgressRow>
                          <ProgressLabel>
                            <span>Ngày bận nhất</span>
                            {busiestDay > 0 ? (
                              <span>
                                Ngày <strong>{busiestDay}</strong> • {busiestCount} đơn
                              </span>
                            ) : (
                              <span>Không có lịch hẹn</span>
                            )}
                          </ProgressLabel>
                          <ProgressTrack>
                            <ProgressFill
                              $w={total > 0 ? (busiestCount * 100) / (total || 1) : 0}
                            />
                          </ProgressTrack>
                        </ProgressRow>
                      </li>

                      <li>
                        <ProgressRow>
                          <ProgressLabel>
                            <span>Trung bình mỗi ngày</span>
                            <span>
                              {avgPerDay.toFixed(1)} đơn/ngày • {daysInMonth} ngày
                            </span>
                          </ProgressLabel>
                          <ProgressTrack>
                            <ProgressFill
                              $w={busiestCount > 0 ? (avgPerDay * 100) / busiestCount : 0}
                              $c="linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                            />
                          </ProgressTrack>
                        </ProgressRow>
                      </li>

                      <li>
                        <ProgressRow>
                          <ProgressLabel>
                            <span>Tổng so với mục tiêu tháng</span>
                            <span>
                              {total}/{monthlyTarget} đơn
                            </span>
                          </ProgressLabel>
                          <ProgressTrack>
                            <ProgressFill
                              $w={(total * 100) / (monthlyTarget || 1)}
                              $c="linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)"
                            />
                          </ProgressTrack>
                        </ProgressRow>
                      </li>
                    </SummaryList>
                  </>
                );
              })()}
            </SummaryCard>
          </AnalyticsGrid>
        </Section>
      </Inner>
    </PageContainer>
  );
};

export default AdminDashboardPage;
