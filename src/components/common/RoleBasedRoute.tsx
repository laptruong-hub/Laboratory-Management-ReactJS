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

  // Enhanced role matching - handles variations like "RECEPTIONIST", "Receptionist", etc.
  const hasAccess = normalizedAllowedRoles.some((allowedRole) => {
    // Exact match
    if (normalizedUserRole === allowedRole) {
      return true;
    }
    // Contains match (for partial matches)
    if (normalizedUserRole.includes(allowedRole) || allowedRole.includes(normalizedUserRole)) {
      return true;
    }
    // Special handling for common role variations
    const roleVariations: Record<string, string[]> = {
      "RECEPTIONIST": ["RECEPTIONIST", "RECEPTION", "RECEIPTIONIST"],
      "ADMIN": ["ADMIN", "ADMINISTRATOR", "ADMINISTRATOR"],
      "LAB USER": ["LAB USER", "LABUSER", "TECHNICIAN", "LAB TECHNICIAN"],
      "PATIENT": ["PATIENT", "CUSTOMER", "CLIENT"],
    };
    
    const variations = roleVariations[allowedRole] || [allowedRole];
    return variations.some(variation => normalizedUserRole === variation.toUpperCase());
  });

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[RoleBasedRoute] Debug:", {
      userRole: user.roleName,
      normalizedUserRole,
      allowedRoles,
      normalizedAllowedRoles,
      hasAccess,
      path: window.location.pathname,
    });
  }

  if (!hasAccess) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[RoleBasedRoute] Access denied:", {
        userRole: user.roleName,
        allowedRoles,
        redirectingTo: redirectTo,
      });
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;

