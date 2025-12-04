import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Component để redirect user dựa trên role của họ
 * Sử dụng khi user vào trang chủ hoặc trang mặc định
 * Dùng sessionStorage để persist qua component re-mounts
 */
const RoleRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasRedirected = sessionStorage.getItem("hasRedirectedByRole") === "true";

    console.log("🔍 RoleRedirect check:", {
      pathname: location.pathname,
      hasRedirected,
      isAuthenticated,
      role: user?.roleName,
    });

    // Chỉ redirect khi:
    // 1. Đang ở homepage "/"
    // 2. CHƯA redirect lần nào trong session này
    if (location.pathname !== "/") {
      console.log("✅ Not on homepage, allow access to:", location.pathname);
      return;
    }

    if (hasRedirected) {
      console.log("✅ Already redirected once, allow homepage access");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log("ℹ️ Not authenticated, stay on homepage");
      // Nếu chưa đăng nhập, giữ nguyên trang hiện tại (homepage)
      return;
    }

    // Normalize role name để so sánh
    const normalizedRole = user.roleName?.trim().toUpperCase() || "";

    // ✅ DEBUG: Log normalized role
    console.log("🔍 Normalized Role:", normalizedRole);

    // Redirect dựa trên role (chỉ 1 lần)
    if (normalizedRole === "ADMIN" || normalizedRole === "ADMINISTRATOR") {
      console.log("🚀 Redirecting ADMIN to dashboard");
      sessionStorage.setItem("hasRedirectedByRole", "true");
      navigate("/admin/admin-dashboard", { replace: true });
    } else if (normalizedRole === "LABORATORY MANAGER" || normalizedRole === "LAB MANAGER") {
      // Có thể thêm redirect cho Lab Manager sau
      // navigate("/lab-manager/dashboard", { replace: true });
    } else if (normalizedRole === "SERVICE" || normalizedRole === "CUSTOMER SERVICE") {
      // Có thể thêm redirect cho Service sau
      // navigate("/service/dashboard", { replace: true });
    } else if (normalizedRole === "LAB USER" || normalizedRole === "TECHNICIAN" || normalizedRole === "LABUSER") {
      console.log("🚀 Redirecting LAB USER to dashboard");
      sessionStorage.setItem("hasRedirectedByRole", "true");
      navigate("/lab-user/dashboard", { replace: true });
    } else if (
      normalizedRole === "RECEPTIONIST" ||
      normalizedRole === "RECEPTION" ||
      normalizedRole.includes("RECEPTIONIST") ||
      normalizedRole.includes("RECEPTION")
    ) {
      console.log("Redirecting RECEPTIONIST to patient requests");
      sessionStorage.setItem("hasRedirectedByRole", "true");
      navigate("/receptionist/dashboard", { replace: true });
    } else if (normalizedRole === "PATIENT" || normalizedRole === "CUSTOMER" || normalizedRole === "CLIENT") {
      console.log("Redirecting PATIENT to profile (first time only)");
      sessionStorage.setItem("hasRedirectedByRole", "true");
      navigate("/user/profile"); // Patient vào trang profile → tab "Kết quả xét nghiệm"
    } else {
      console.log("No role match, stay on homepage");
    }
  }, [user, loading, isAuthenticated, navigate, location.pathname]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải..." />;
  }

  // Return null vì redirect sẽ được xử lý bởi useEffect
  return null;
};

export default RoleRedirect;
