# Migration Guide: Styling Conventions từ BloodDonationSupportSystem_FE

## Tổng Quan

Tài liệu này hướng dẫn cách migrate từ styled-components/CSS files sang Tailwind CSS + shadcn/ui theo quy ước của BloodDonationSupportSystem_FE.

## ✅ Đã Hoàn Thành

### 1. Setup Cơ Bản
- ✅ Cài đặt dependencies: Tailwind CSS v4, shadcn/ui, Framer Motion
- ✅ Cấu hình Vite với Tailwind plugin và path aliases (`@/`)
- ✅ Cấu hình TypeScript paths
- ✅ Tạo `components.json` cho shadcn/ui
- ✅ Tạo `lib/utils.ts` với hàm `cn()`
- ✅ Migrate `index.css` với Tailwind và CSS variables
- ✅ Tạo thư mục `components/ui/`
- ✅ Tạo UI components cơ bản: Button, Input, Label

## 📋 Các Bước Tiếp Theo

### 2. Cài Đặt Dependencies

Chạy lệnh sau để cài đặt tất cả dependencies:

```bash
npm install
```

### 3. Thêm shadcn/ui Components

Sử dụng CLI của shadcn/ui để thêm các components cần thiết:

```bash
npx shadcn@latest add form
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
```

### 4. Migrate Components

#### Pattern Migration:

**Trước (styled-components):**
```tsx
const Card = styled.div`
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;
```

**Sau (Tailwind):**
```tsx
<div className="bg-white border border-border rounded-xl p-4 shadow-md">
  {/* Content */}
</div>
```

**Hoặc sử dụng shadcn/ui Card:**
```tsx
import { Card } from "@/components/ui/card"

<Card className="p-4">
  {/* Content */}
</Card>
```

#### Button Migration:

**Trước:**
```tsx
<button className="btn primary">Click me</button>
```

**Sau:**
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Click me</Button>
```

#### Form Migration:

**Trước:**
```tsx
<input
  style={{
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`
  }}
/>
```

**Sau:**
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### 5. Sử Dụng Theme Colors

Thay vì hardcode màu sắc, sử dụng CSS variables:

**Trước:**
```tsx
style={{ backgroundColor: "#dc2626" }}
```

**Sau:**
```tsx
className="bg-primary"
```

**Hoặc custom colors:**
```tsx
className="bg-[#dc2626] hover:bg-[#b91c1c]"
```

### 6. Animations với Framer Motion

**Trước:**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Sau:**
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### 7. Responsive Design

**Trước:**
```css
@media (max-width: 768px) {
  .page-wrapper {
    padding: 1rem;
  }
}
```

**Sau:**
```tsx
<div className="p-4 md:p-8 lg:p-12">
  {/* Content */}
</div>
```

### 8. Component Migration Priority

1. **High Priority:**
   - `components/common/Header.tsx` → Migrate navbar
   - `components/dashboard/StatCard.tsx` → Migrate cards
   - `components/dashboard/UsersTable.tsx` → Migrate tables

2. **Medium Priority:**
   - `components/admin/AccountDetailModal.tsx` → Migrate modals
   - `components/user/UserProfile.tsx` → Migrate forms

3. **Low Priority:**
   - Layout components
   - Utility components

## 🎨 Color Mapping

| Old (theme.ts) | New (CSS Variables) | Tailwind Class |
|---------------|---------------------|----------------|
| `theme.colors.primary` | `--primary` | `bg-primary` |
| `theme.colors.primaryDark` | `--primary-dark` | `bg-[#b91c1c]` |
| `theme.colors.background` | `--background` | `bg-background` |
| `theme.colors.textDark` | `--foreground` | `text-foreground` |
| `theme.colors.border` | `--border` | `border-border` |
| `theme.colors.error` | `--destructive` | `bg-destructive` |
| `theme.colors.success` | `--success` | `bg-[#16a34a]` |

## 📝 Best Practices

1. **Luôn sử dụng `cn()` utility:**
   ```tsx
   import { cn } from "@/lib/utils"
   className={cn("base-classes", conditionalClass && "conditional-class")}
   ```

2. **Sử dụng component variants:**
   ```tsx
   <Button variant="default" size="lg">Click</Button>
   ```

3. **Mobile-first responsive:**
   ```tsx
   className="text-sm sm:text-base lg:text-lg"
   ```

4. **Accessibility:**
   ```tsx
   <button aria-label="Close menu">
   <nav aria-label="Main navigation">
   ```

5. **Animations:**
   - Sử dụng Framer Motion cho complex animations
   - Sử dụng Tailwind transitions cho simple hover effects

## 🚀 Next Steps

1. Cài đặt dependencies: `npm install`
2. Thêm shadcn/ui components cần thiết
3. Migrate một component mẫu (ví dụ: StatCard)
4. Tạo `UI_CONVENTIONS.md` dựa trên BloodDonationSupportSystem_FE
5. Migrate từng component một cách có hệ thống

## 📚 Tài Liệu Tham Khảo

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- `BloodDonationSupportSystem_FE/UI_CONVENTIONS.md`

