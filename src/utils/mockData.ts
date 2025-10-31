export type BreakdownItem = { label: string; value: number; percent: number; color: string };

export const dashboardStats = {
  totalUsers: {
    title: 'Tổng người dùng',
    value: 1245,
    growth: 8.2,
    description: '↑ 8.2% so với tháng trước',
  },
  todayTests: {
    title: 'Kết nghiệm hôm nay',
    value: 212,
    breakdown: [
      { label: 'Chờ xử lý', value: 68, percent: 32, color: '#FAAD14' },
      { label: 'Đang xử lý', value: 98, percent: 46, color: '#1890FF' },
      { label: 'Hoàn thành', value: 46, percent: 22, color: '#52C41A' },
    ] as BreakdownItem[],
  },
  completedTests: {
    title: 'Đơn hoàn thành',
    value: 37,
    description: '6 đơn bác sĩ xác nhận',
  },
  growthRate: {
    title: 'Tăng trưởng',
    value: '+8.2%',
    trend: 'up' as const,
  },
};

export type TrendPoint = { date: string; value: number };

export const trendData = {
  title: 'Xu hướng đơn xét nghiệm',
  period: '14 ngày gần nhất',
  data: [
    { date: '10/17', value: 145 },
    { date: '10/18', value: 152 },
    { date: '10/19', value: 148 },
    { date: '10/20', value: 156 },
    { date: '10/21', value: 163 },
    { date: '10/22', value: 158 },
    { date: '10/23', value: 171 },
    { date: '10/24', value: 169 },
    { date: '10/25', value: 177 },
    { date: '10/26', value: 182 },
    { date: '10/27', value: 179 },
    { date: '10/28', value: 188 },
    { date: '10/29', value: 195 },
    { date: '10/30', value: 192 },
  ] as TrendPoint[],
};

export type ParameterItem = { name: string; count: number; percent: number };

export const parameterDistribution = {
  title: 'Phân bố xét nghiệm theo Parameter',
  totalTypes: 15,
  data: [
    { name: 'HbA1c', count: 45, percent: 18.5 },
    { name: 'Glucose', count: 42, percent: 17.3 },
    { name: 'Cholesterol', count: 38, percent: 15.6 },
    { name: 'Triglycerides', count: 35, percent: 14.4 },
    { name: 'HDL', count: 31, percent: 12.8 },
    { name: 'LDL', count: 28, percent: 11.5 },
    { name: 'Creatinine', count: 24, percent: 9.9 },
    { name: 'Urea', count: 21, percent: 8.6 },
    { name: 'ALT', count: 18, percent: 7.4 },
    { name: 'AST', count: 15, percent: 6.2 },
  ] as ParameterItem[],
};

export type RoleSlice = { role: string; count: number; percent: number; color: string };

export const roleDistribution = {
  title: 'Phân bố tài khoản theo vai trò',
  total: 373,
  data: [
    { role: 'Administrator', count: 146, percent: 39.1, color: '#52C41A' },
    { role: 'Lab Manager', count: 117, percent: 31.4, color: '#1890FF' },
    { role: 'Lab User', count: 74, percent: 19.8, color: '#FAAD14' },
    { role: 'Service', count: 36, percent: 9.7, color: '#F5222D' },
  ] as RoleSlice[],
};

export type HeatmapCell = { date: number; day: number; count: number; intensity: number };

export const heatmapData = {
  month: 'Tháng 10, 2025',
  totalAppointments: '14.518 buổi hẹn',
  data: Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    day: new Date(2025, 9, i + 1).getDay(),
    count: Math.floor(Math.random() * 40),
    intensity: Math.random(),
  })) as HeatmapCell[],
  colorScale: [
    { min: 0, max: 5, color: '#FFFFFF' },
    { min: 6, max: 15, color: '#FFEBEE' },
    { min: 16, max: 25, color: '#FFCDD2' },
    { min: 26, max: 35, color: '#EF5350' },
    { min: 36, max: 50, color: '#C62828' },
  ],
};


