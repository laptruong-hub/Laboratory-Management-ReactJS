# Role-Based Routing Refactor

## Tổng Quan

Refactor này thêm role-based routing và auto-redirect cho admin role. Khi user có role là Admin hoặc Administrator, họ sẽ tự động được redirect đến admin dashboard khi vào trang chủ hoặc `/admin`.

## Các Component Mới

### 1. `RoleBasedRoute.tsx`

Component để protect routes dựa trên role của user.

**Cách sử dụng:**
```tsx
<RoleBasedRoute allowedRoles={["Admin", "Administrator"]} />
```

**Chức năng:**
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra role của user có trong `allowedRoles` không
- Redirect đến `/forbidden` nếu không có quyền
- Redirect đến `/auth/login` nếu chưa đăng nhập

**Props:**
- `allowedRoles: string[]` - Mảng các role được phép truy cập
- `redirectTo?: string` - Route để redirect nếu không có quyền (mặc định: `/forbidden`)

### 2. `RoleRedirect.tsx`

Component để tự động redirect user dựa trên role khi vào trang chủ.

**Chức năng:**
- Kiểm tra role của user đã đăng nhập
- Tự động redirect:
  - **Admin/Administrator** → `/admin/admin-dashboard`
  - Các role khác: có thể thêm sau

**Lưu ý:**
- Chỉ redirect nếu user đã đăng nhập
- Nếu chưa đăng nhập, giữ nguyên trang hiện tại (homepage)

## Cấu Trúc Routing

### Trước Refactor

```tsx
{
  path: "/admin",
  element: <WorkingLayout />,
  children: [
    { path: "admin-dashboard", element: <AdminDashboardPage /> },
    // ...
  ],
}
```

### Sau Refactor

```tsx
{
  path: "/admin",
  element: <RoleBasedRoute allowedRoles={["Admin", "Administrator"]} />,
  children: [
    {
      element: <WorkingLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/admin/admin-dashboard" replace />,
        },
        { path: "admin-dashboard", element: <AdminDashboardPage /> },
        // ...
      ],
    },
  ],
}
```

### Homepage với Auto-Redirect

```tsx
{
  index: true,
  element: (
    <>
      <RoleRedirect />
      <Home />
    </>
  ),
}
```

## Flow Hoạt Động

### 1. Admin vào Trang Chủ (`/`)

1. User đăng nhập với role "Admin"
2. Vào trang chủ `/`
3. `RoleRedirect` component kiểm tra role
4. Tự động redirect đến `/admin/admin-dashboard`

### 2. Admin vào `/admin`

1. User đăng nhập với role "Admin"
2. Vào `/admin`
3. `RoleBasedRoute` kiểm tra role → ✅ Có quyền
4. Index route redirect đến `/admin/admin-dashboard`

### 3. Non-Admin vào `/admin`

1. User đăng nhập với role khác (ví dụ: "Lab User")
2. Vào `/admin`
3. `RoleBasedRoute` kiểm tra role → ❌ Không có quyền
4. Redirect đến `/forbidden`

### 4. Chưa Đăng Nhập vào `/admin`

1. User chưa đăng nhập
2. Vào `/admin`
3. `PrivateRoute` kiểm tra authentication → ❌ Chưa đăng nhập
4. Redirect đến `/auth/login`

## Role Name Normalization

Các component sử dụng normalization để so sánh role:

```tsx
// Case-insensitive, trim whitespace
const normalizedRole = user.roleName?.trim().toUpperCase() || "";
```

**Ví dụ:**
- `"Admin"` → `"ADMIN"` ✅
- `"Administrator"` → `"ADMINISTRATOR"` ✅
- `" admin "` → `"ADMIN"` ✅

## Mở Rộng cho Các Role Khác

Để thêm auto-redirect cho các role khác, cập nhật `RoleRedirect.tsx`:

```tsx
if (normalizedRole === "LABORATORY MANAGER" || normalizedRole === "LAB MANAGER") {
  navigate("/lab-manager/dashboard", { replace: true });
} else if (normalizedRole === "SERVICE" || normalizedRole === "CUSTOMER SERVICE") {
  navigate("/service/dashboard", { replace: true });
} else if (normalizedRole === "LAB USER" || normalizedRole === "TECHNICIAN") {
  navigate("/lab-user/dashboard", { replace: true });
}
```

## Testing

### Test Cases

1. ✅ Admin vào `/` → Redirect đến `/admin/admin-dashboard`
2. ✅ Admin vào `/admin` → Redirect đến `/admin/admin-dashboard`
3. ✅ Admin vào `/admin/admin-dashboard` → Hiển thị dashboard
4. ✅ Non-Admin vào `/admin` → Redirect đến `/forbidden`
5. ✅ Chưa đăng nhập vào `/admin` → Redirect đến `/auth/login`
6. ✅ Chưa đăng nhập vào `/` → Hiển thị homepage (không redirect)

## Files Đã Thay Đổi

1. ✅ `src/components/common/RoleBasedRoute.tsx` - Mới
2. ✅ `src/components/common/RoleRedirect.tsx` - Mới
3. ✅ `src/App.tsx` - Cập nhật routing structure

## Lưu Ý

- Role names được normalize (uppercase, trim) để tránh lỗi so sánh
- `RoleBasedRoute` sử dụng `Outlet` để render child routes
- `RoleRedirect` chỉ redirect nếu user đã đăng nhập
- Index route `/admin` tự động redirect đến dashboard

## Next Steps

1. Thêm role-based routing cho các role khác (Lab Manager, Service, Lab User)
2. Tạo dashboard pages cho từng role
3. Thêm role-based redirect cho các role khác trong `RoleRedirect`
4. Test với các role khác nhau

