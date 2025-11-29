# 🎨 Bắt Đầu Migration Styling Conventions

## ✅ Đã Hoàn Thành

### 1. Dependencies & Configuration
- ✅ Cập nhật `package.json` với các dependencies mới:
  - Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
  - shadcn/ui dependencies (`@radix-ui/*`, `@shadcn/ui`)
  - Framer Motion (`framer-motion`)
  - Utilities (`class-variance-authority`, `clsx`, `tailwind-merge`, `zod`, `react-hook-form`)

### 2. Build Configuration
- ✅ Cập nhật `vite.config.ts`:
  - Thêm Tailwind plugin
  - Thêm path alias `@/` → `./src/`
- ✅ Cập nhật `tsconfig.app.json`:
  - Thêm `baseUrl` và `paths` cho TypeScript path aliases

### 3. Project Structure
- ✅ Tạo `components.json` cho shadcn/ui configuration
- ✅ Tạo `src/lib/utils.ts` với hàm `cn()` utility
- ✅ Tạo thư mục `src/components/ui/` cho UI primitives
- ✅ Tạo các UI components cơ bản:
  - `button.tsx`
  - `input.tsx`
  - `label.tsx`

### 4. Styling Setup
- ✅ Migrate `src/index.css`:
  - Import Tailwind CSS
  - Thêm CSS variables với theme colors từ laboratory-management-reactjs
  - Giữ màu đỏ (#dc2626) làm primary color
  - Hỗ trợ dark mode
  - Base styles với Tailwind

## 📋 Bước Tiếp Theo (Cần Thực Hiện)

### Bước 1: Cài Đặt Dependencies
```bash
cd laboratory-management-reactjs
npm install
```

### Bước 2: Thêm shadcn/ui Components
Sau khi cài đặt dependencies, thêm các components cần thiết:

```bash
# Form components (cho React Hook Form)
npx shadcn@latest add form

# Layout components
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add dialog

# Input components
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add datepicker
```

### Bước 3: Test Setup
Tạo một component test để đảm bảo mọi thứ hoạt động:

```tsx
// src/components/TestComponent.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TestComponent() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Test Component</h1>
      <div className="space-y-2">
        <Label htmlFor="test-input">Test Input</Label>
        <Input id="test-input" placeholder="Enter text..." />
      </div>
      <div className="flex gap-2">
        <Button variant="default">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
    </div>
  )
}
```

### Bước 4: Migrate Components
Bắt đầu migrate từng component một. Xem `MIGRATION_GUIDE.md` để biết chi tiết.

**Ưu tiên:**
1. `components/dashboard/StatCard.tsx` - Component đơn giản, dễ migrate
2. `components/common/Header.tsx` - Navbar component
3. `components/dashboard/UsersTable.tsx` - Table component

### Bước 5: Tạo UI_CONVENTIONS.md
Copy và adapt từ `BloodDonationSupportSystem_FE/UI_CONVENTIONS.md` với theme colors của laboratory-management-reactjs.

## 🎨 Theme Colors

Theme colors đã được setup trong `index.css`:

- **Primary**: `#dc2626` (Red - giữ nguyên từ theme cũ)
- **Primary Dark**: `#b91c1c`
- **Primary Light**: `#fee2e2`
- **Background**: `#ffffff`
- **Foreground**: `#1f2937`
- **Border**: `#e5e5e5`

Sử dụng trong code:
```tsx
className="bg-primary text-primary-foreground"
className="bg-[#dc2626] hover:bg-[#b91c1c]"
```

## 📚 Tài Liệu

- `MIGRATION_GUIDE.md` - Hướng dẫn chi tiết cách migrate components
- `SO_SANH_UI_UX_STYLING.md` - So sánh giữa hai dự án
- `BloodDonationSupportSystem_FE/UI_CONVENTIONS.md` - Quy ước styling gốc

## ⚠️ Lưu Ý

1. **Không xóa styled-components ngay**: Giữ lại để migrate từng phần
2. **Test từng component**: Đảm bảo mỗi component hoạt động trước khi migrate tiếp
3. **Giữ theme colors**: Màu đỏ (#dc2626) là brand color, không thay đổi
4. **Backup code cũ**: Commit trước khi migrate để có thể rollback

## 🚀 Quick Start

```bash
# 1. Cài đặt dependencies
npm install

# 2. Thêm shadcn/ui components
npx shadcn@latest add form card table

# 3. Chạy dev server
npm run dev

# 4. Test với component mẫu
# Import và sử dụng Button, Input, Label trong một component
```

## 📝 Checklist

- [x] Setup dependencies
- [x] Configure Vite & TypeScript
- [x] Create UI components (button, input, label)
- [x] Migrate index.css
- [ ] Install npm dependencies
- [ ] Add shadcn/ui components (form, card, table, etc.)
- [ ] Create UI_CONVENTIONS.md
- [ ] Migrate first component (StatCard)
- [ ] Test và verify

---

**Bắt đầu từ đây:** Chạy `npm install` và tiếp tục với các bước trên!

