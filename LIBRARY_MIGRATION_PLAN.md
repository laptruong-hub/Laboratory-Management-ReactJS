# Library Migration Plan: Replace UI Libraries

## So Sánh Libraries

### laboratory-management-reactjs (Hiện Tại)

**UI/Styling Libraries:**

- ❌ `bootstrap: ^5.1.3` - Cần xóa
- ❌ `react-bootstrap: ^2.2.2` - Cần xóa
- ❌ `styled-components: ^6.1.19` - Cần xóa
- ✅ `tailwindcss: ^4.1.8` - Giữ lại
- ✅ `@tailwindcss/vite: ^4.1.8` - Giữ lại
- ✅ `@shadcn/ui: ^0.0.4` - Giữ lại
- ✅ `framer-motion: ^12.16.0` - Giữ lại
- ✅ `class-variance-authority: ^0.7.1` - Giữ lại
- ✅ `clsx: ^2.1.1` - Giữ lại
- ✅ `tailwind-merge: ^3.3.0` - Giữ lại

**Dev Dependencies:**

- ❌ `@types/styled-components: ^5.1.34` - Cần xóa

### BloodDonationSupportSystem_FE (Target)

**UI/Styling Libraries:**

- ✅ `tailwindcss: ^4.1.8`
- ✅ `@tailwindcss/vite: ^4.1.8`
- ✅ `@shadcn/ui: ^0.0.4`
- ✅ `framer-motion: ^12.16.0`
- ✅ `class-variance-authority: ^0.7.1`
- ✅ `clsx: ^2.1.1`
- ✅ `tailwind-merge: ^3.3.0`
- ✅ `tw-animate-css: ^1.3.3` - **Cần thêm**

**Không có:**

- ❌ bootstrap
- ❌ react-bootstrap
- ❌ styled-components

## Migration Steps

### Bước 1: Cập Nhật package.json

**Xóa:**

- `bootstrap`
- `react-bootstrap`
- `styled-components`
- `@types/styled-components`

**Thêm:**

- `tw-animate-css: ^1.3.3`

**Giữ lại:**

- Tất cả Tailwind và shadcn/ui dependencies

### Bước 2: Cập Nhật index.css

Thêm `tw-animate-css` import:

```css
@import "tailwindcss";
@import "tw-animate-css"; // Thêm dòng này
```

### Bước 3: Xóa Bootstrap Imports

Tìm và xóa tất cả:

- `import "bootstrap/dist/css/bootstrap.min.css"`
- `import Container from "react-bootstrap/Container"`
- `import Nav from "react-bootstrap/Nav"`
- `import Navbar from "react-bootstrap/Navbar"`

### Bước 4: Migrate Components

**Priority 1 - High:**

1. `Header.tsx` - Đang dùng react-bootstrap Navbar
2. Components dùng styled-components nhiều

**Priority 2 - Medium:**

1. Layout components
2. Common components

**Priority 3 - Low:**

1. Page components
2. Feature components

### Bước 5: Xóa theme.ts

File `src/theme/theme.ts` không cần thiết nữa vì đã có CSS variables trong `index.css`.

## Files Cần Migrate

### Components dùng react-bootstrap:

- `src/components/common/Header.tsx` - Navbar, Container, Nav

### Components dùng styled-components:

- `src/components/common/Header.tsx` - Nhiều styled components
- `src/pages/home/Homepage.tsx` - Nhiều styled components
- `src/components/dashboard/StatCard.tsx`
- `src/components/dashboard/UsersTable.tsx`
- `src/components/dashboard/OrdersTable.tsx`
- `src/components/layout/WorkingLayout.tsx`
- Và nhiều components khác...

## Migration Strategy

### Phase 1: Setup (Đã hoàn thành)

- ✅ Tailwind CSS v4 setup
- ✅ shadcn/ui components
- ✅ CSS variables

### Phase 2: Remove Old Libraries

- ⏳ Xóa bootstrap, react-bootstrap, styled-components từ package.json
- ⏳ Xóa imports từ main.tsx
- ⏳ Xóa @types/styled-components

### Phase 3: Migrate Components

- ⏳ Migrate Header.tsx (high priority)
- ⏳ Migrate các components khác từng phần

### Phase 4: Cleanup

- ⏳ Xóa theme.ts (nếu không dùng nữa)
- ⏳ Xóa các CSS files riêng (nếu có)
- ⏳ Update documentation

## Estimated Impact

**Files cần migrate:** ~20-30 components
**Time estimate:** 2-3 days
**Breaking changes:** Medium (cần test kỹ)
