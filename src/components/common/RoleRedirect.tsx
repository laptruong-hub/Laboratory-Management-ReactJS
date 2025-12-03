import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Component để redirect user dựa trên role của họ
 * Sử dụng khi user vào trang chủ hoặc trang mặc định
 */
const RoleRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      // Nếu chưa đăng nhập, giữ nguyên trang hiện tại (homepage)
      return;
    }

    // Normalize role name để so sánh
    const normalizedRole = user.roleName?.trim().toUpperCase() || "";

    // Redirect dựa trên role
    if (normalizedRole === "ADMIN" || normalizedRole === "ADMINISTRATOR") {
      navigate("/admin/admin-dashboard", { replace: true });
    } else if (normalizedRole === "LABORATORY MANAGER" || normalizedRole === "LAB MANAGER") {
      // Có thể thêm redirect cho Lab Manager sau
      // navigate("/lab-manager/dashboard", { replace: true });
    } else if (normalizedRole === "SERVICE" || normalizedRole === "CUSTOMER SERVICE") {
      // Có thể thêm redirect cho Service sau
      // navigate("/service/dashboard", { replace: true });
    } else if (normalizedRole === "LAB USER" || normalizedRole === "TECHNICIAN") {
      navigate("/lab-user/dashboard", { replace: true });
    } else if (normalizedRole === "RECEPTIONIST") {
      navigate("/receptionist/dashboard", { replace: true });
    }
    // Nếu không match role nào, giữ nguyên trang hiện tại
  }, [user, loading, isAuthenticated, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải..." />;
  }

  // Return null vì redirect sẽ được xử lý bởi useEffect
  return null;
};

export default RoleRedirect;

