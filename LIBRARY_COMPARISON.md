# So Sánh Libraries Giữa Hai Dự Án

## Tổng Quan

Báo cáo này so sánh các libraries giữa:
- **laboratory-management-reactjs**: Dự án hiện tại
- **BloodDonationSupportSystem_FE**: Dự án mẫu (target)

## UI/Styling Libraries

### laboratory-management-reactjs (Trước Migration)

| Library | Version | Status | Action |
|---------|---------|--------|--------|
| `bootstrap` | ^5.1.3 | ❌ Cần xóa | Xóa |
| `react-bootstrap` | ^2.2.2 | ❌ Cần xóa | Xóa |
| `styled-components` | ^6.1.19 | ❌ Cần xóa | Xóa |
| `tailwindcss` | ^4.1.8 | ✅ Giữ lại | Giữ |
| `@tailwindcss/vite` | ^4.1.8 | ✅ Giữ lại | Giữ |
| `@shadcn/ui` | ^0.0.4 | ✅ Giữ lại | Giữ |
| `framer-motion` | ^12.16.0 | ✅ Giữ lại | Giữ |
| `class-variance-authority` | ^0.7.1 | ✅ Giữ lại | Giữ |
| `clsx` | ^2.1.1 | ✅ Giữ lại | Giữ |
| `tailwind-merge` | ^3.3.0 | ✅ Giữ lại | Giữ |
| `tw-animate-css` | - | ⚠️ Thiếu | **Thêm** |

### BloodDonationSupportSystem_FE (Target)

| Library | Version | Status |
|---------|---------|--------|
| `tailwindcss` | ^4.1.8 | ✅ |
| `@tailwindcss/vite` | ^4.1.8 | ✅ |
| `@shadcn/ui` | ^0.0.4 | ✅ |
| `framer-motion` | ^12.16.0 | ✅ |
| `class-variance-authority` | ^0.7.1 | ✅ |
| `clsx` | ^2.1.1 | ✅ |
| `tailwind-merge` | ^3.3.0 | ✅ |
| `tw-animate-css` | ^1.3.3 | ✅ |
| `bootstrap` | - | ❌ Không có |
| `react-bootstrap` | - | ❌ Không có |
| `styled-components` | - | ❌ Không có |

## Form Libraries

### laboratory-management-reactjs
- ✅ `react-hook-form: ^7.57.0`
- ✅ `@hookform/resolvers: ^5.0.1`
- ✅ `zod: ^3.25.47`

### BloodDonationSupportSystem_FE
- ✅ `react-hook-form: ^7.57.0`
- ✅ `@hookform/resolvers: ^5.0.1`
- ✅ `zod: ^3.25.47`

**Kết luận:** Giống nhau, không cần thay đổi.

## Icon Libraries

### laboratory-management-reactjs
- ✅ `lucide-react: ^0.546.0`
- ✅ `react-icons: ^5.5.0`

### BloodDonationSupportSystem_FE
- ✅ `lucide-react: ^0.511.0`
- ✅ `react-icons: ^5.5.0`

**Kết luận:** Giống nhau, có thể update lucide-react version.

## Animation Libraries

### laboratory-management-reactjs
- ✅ `framer-motion: ^12.16.0`

### BloodDonationSupportSystem_FE
- ✅ `framer-motion: ^12.16.0`
- ✅ `tw-animate-css: ^1.3.3` - **Cần thêm**

**Kết luận:** Cần thêm `tw-animate-css`.

## Routing Libraries

### laboratory-management-reactjs
- ✅ `react-router-dom: ^7.9.4`

### BloodDonationSupportSystem_FE
- ✅ `react-router-dom: ^7.6.1`

**Kết luận:** Tương tự, không cần thay đổi.

## Notification Libraries

### Cả hai dự án
- ✅ `react-toastify: ^11.0.5`

**Kết luận:** Giống nhau.

## Dev Dependencies

### laboratory-management-reactjs
- ❌ `@types/styled-components: ^5.1.34` - **Cần xóa**

### BloodDonationSupportSystem_FE
- ✅ `tw-animate-css: ^1.3.3` (trong devDependencies)
- ❌ Không có `@types/styled-components`

## Files Sử Dụng Libraries Cần Xóa

### Files dùng `styled-components` (20 files):
1. `src/components/common/Header.tsx`
2. `src/components/common/Footer.tsx`
3. `src/pages/home/Homepage.tsx`
4. `src/pages/dashboard/AdminDashboard.tsx`
5. `src/pages/booking/BookingPage.tsx`
6. `src/pages/role/RolesPage.tsx`
7. `src/pages/admin/WorkSlotManage.tsx`
8. `src/pages/admin/PatientManage.tsx`
9. `src/components/working/WorkingSidebar.tsx`
10. `src/components/layout/WorkingLayout.tsx`
11. `src/components/working/WorkingUserInfo.tsx`
12. `src/components/dashboard/UsersTable.tsx`
13. `src/components/dashboard/OrdersTable.tsx`
14. `src/components/dashboard/TopBar/TopBarActions.tsx`
15. `src/components/dashboard/DashboardCards/StatCard.tsx`
16. `src/components/dashboard/DashboardCards/MiniBarChart.tsx`
17. `src/components/dashboard/Charts/TrendChart.tsx`
18. `src/components/dashboard/Charts/DonutChart.tsx`
19. `src/components/dashboard/Charts/HeatmapCalendar.tsx`
20. `src/components/dashboard/Charts/HorizontalBarChart.tsx`

### Files dùng `react-bootstrap` (1 file):
1. `src/components/common/Header.tsx` - Container, Nav, Navbar

### Files import Bootstrap CSS (1 file):
1. `src/main.tsx` - `import "bootstrap/dist/css/bootstrap.min.css"`

## Migration Checklist

### ✅ Đã Hoàn Thành
- [x] Cập nhật package.json - xóa bootstrap, react-bootstrap, styled-components
- [x] Thêm tw-animate-css vào package.json
- [x] Cập nhật index.css với tw-animate-css import
- [x] Xóa bootstrap import từ main.tsx
- [x] Xóa @types/styled-components từ devDependencies

### ⏳ Cần Làm
- [ ] Migrate Header.tsx từ react-bootstrap + styled-components sang Tailwind
- [ ] Migrate các components dùng styled-components (20 files)
- [ ] Test tất cả components sau migration
- [ ] Xóa theme.ts nếu không dùng nữa

## Next Steps

1. **Chạy `npm install`** để cài đặt/cập nhật dependencies
2. **Migrate Header.tsx** - Component quan trọng nhất
3. **Migrate từng component** một cách có hệ thống
4. **Test và verify** sau mỗi migration

## Lưu Ý

- **Không xóa ngay:** Giữ lại code cũ trong comments để reference
- **Test từng phần:** Migrate và test từng component
- **Backup:** Commit trước khi migration
- **Incremental:** Migrate từng component một, không làm tất cả cùng lúc

