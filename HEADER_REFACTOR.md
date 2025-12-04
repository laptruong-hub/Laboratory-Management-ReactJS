# Header Refactor - Guest User Buttons

## Tổng Quan

Refactor header component để cải thiện UI/UX cho guest users (non-authenticated users) với Login và Sign Up buttons đẹp hơn và rõ ràng hơn.

## Thay Đổi

### Trước Refactor

- Sử dụng `Nav.Link` với className `btn btn-outline-primary text-white px-2`
- Buttons không có styling riêng, phụ thuộc vào Bootstrap classes
- Không có sự phân biệt rõ ràng giữa Login và Sign Up buttons
- Mobile menu có buttons đơn giản

### Sau Refactor

- Tạo styled components riêng cho auth buttons:
  - `AuthButtonsContainer` - Container cho buttons
  - `AuthButton` - Button component với 2 variants: `primary` và `outline`

#### Desktop Buttons

**Login Button (Outline):**
- Background: transparent
- Border: white với opacity 0.5
- Text: white
- Hover: background với white opacity 0.15, border opacity 0.8

**Sign Up Button (Primary):**
- Background: white
- Text: red (#dc2626)
- Border: white
- Hover: background với white opacity 0.9

#### Mobile Buttons

- Login button: transparent background với border
- Sign Up button: gradient background (red) với white text, rounded corners

## Styling Details

### AuthButton Component

```tsx
<AuthButton
  to="/auth/login"
  $variant="outline"  // hoặc "primary"
  $scrolled={scrolled}
>
  Đăng nhập
</AuthButton>
```

**Props:**
- `$variant`: `"primary"` | `"outline"` - Style variant
- `$scrolled`: `boolean` - Responsive sizing dựa trên scroll state

**Features:**
- Smooth transitions
- Hover effects với transform và shadow
- Responsive: full width trên mobile
- Consistent với design system (red theme)

## Responsive Design

### Desktop (> 991px)
- Buttons hiển thị inline với gap 0.75rem
- Padding responsive dựa trên scroll state

### Mobile (≤ 991px)
- Buttons stack vertically
- Full width
- Consistent padding

## Mobile Menu

Mobile menu cũng được cải thiện:
- Login button: transparent với border
- Sign Up button: gradient background với white text, rounded corners
- Better visual hierarchy

## Files Đã Thay Đổi

1. ✅ `src/components/common/Header.tsx`
   - Thêm `AuthButtonsContainer` styled component
   - Thêm `AuthButton` styled component
   - Cập nhật desktop auth buttons section
   - Cập nhật mobile menu auth buttons

## Testing

### Test Cases

1. ✅ Guest user vào homepage → Thấy Login và Sign Up buttons
2. ✅ Click Login button → Navigate đến `/auth/login`
3. ✅ Click Sign Up button → Navigate đến `/auth/signup`
4. ✅ Scroll navbar → Buttons resize appropriately
5. ✅ Mobile view → Buttons stack vertically, full width
6. ✅ Mobile menu → Buttons có styling đẹp
7. ✅ Authenticated user → Không thấy auth buttons, thấy profile button

## Visual Improvements

### Before
- Generic Bootstrap buttons
- Không có visual hierarchy rõ ràng
- Không có hover effects đẹp

### After
- Custom styled buttons với design system
- Clear visual hierarchy (Sign Up button nổi bật hơn)
- Smooth hover effects
- Consistent với theme colors (red #dc2626)
- Better mobile experience

## Next Steps

Có thể cải thiện thêm:
1. Thêm icons cho buttons (nếu cần)
2. Thêm loading states khi navigate
3. Thêm animation khi buttons appear/disappear
4. Consider using Tailwind classes nếu migrate sang Tailwind

