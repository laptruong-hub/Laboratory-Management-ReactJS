import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface RoleBasedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * Component để protect routes dựa trên role của user
 * @param allowedRoles - Mảng các role được phép truy cập
 * @param redirectTo - Route để redirect nếu không có quyền (mặc định: /forbidden)
 */
const RoleBasedRoute = ({ allowedRoles, redirectTo = "/forbidden" }: RoleBasedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang kiểm tra quyền truy cập..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Normalize role name để so sánh (case-insensitive, trim whitespace)
  const normalizedUserRole = user.roleName?.trim().toUpperCase() || "";
  const normalizedAllowedRoles = allowedRoles.map((role) => role.trim().toUpperCase());

  // Check nếu user role có trong allowed roles
  const hasAccess = normalizedAllowedRoles.some(
    (allowedRole) => normalizedUserRole === allowedRole || normalizedUserRole.includes(allowedRole)
  );

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;

