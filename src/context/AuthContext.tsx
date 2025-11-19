import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, apiPublic } from "../api/apiClient"; // Import trạm API

// 1. Định nghĩa "kiểu" của User (hoặc dùng "any" nếu lười)
interface User {
  id: number;
  email: string;
  fullName: string;
  roleName: string;
  avatarUrl?: string;
  // (Thêm các trường khác nếu cần)
}

// 2. Định nghĩa "kiểu" của Kho (Context)
interface AuthContextType {
  user: User | null; // Thông tin user (hoặc null nếu là khách)
  loading: boolean; // Trạng thái đang tải
  isAuthenticated: boolean; // Đã đăng nhập hay chưa?
  refreshUser: () => Promise<void>; // Hàm để refresh user data
  logout: () => Promise<void>; // Hàm để đăng xuất (gọi API)
}

// 3. Tạo "Kho"
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Tạo "Người Quản Lý Kho" (AuthProvider)
// Đây là component sẽ fetch API và cung cấp dữ liệu
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Bắt đầu là "true"

  const fetchMyProfile = async () => {
    try {
      const response = await apiClient.get("/api/users/me");
      setUser(response.data); // Lưu user vào kho
    } catch (error) {
      // Error logged for debugging - user will remain null if 401
      if (process.env.NODE_ENV === "development") {
        console.error("AuthContext: Không thể fetch user", error);
      }
    } finally {
      setLoading(false); // Xong, tắt loading
    }
  };

  useEffect(() => {
    // Kiểm tra xem có token không
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchMyProfile(); // Nếu có token -> mới fetch
    } else {
      setLoading(false); // Nếu không có token -> Khách -> Tắt loading
    }
  }, []);

  const refreshUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setLoading(true);
      await fetchMyProfile();
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout endpoint
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await apiPublic.post("/api/auth/logout", { refreshToken });
      }
    } catch (error) {
      // Error logged for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("Lỗi khi gọi API logout:", error);
      }
    } finally {
      // Xóa tokens từ localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Clear user từ state
      setUser(null);

      // Redirect đến trang chủ
      window.location.href = "/";
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user, // Nếu "user" có dữ liệu -> true
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Tạo "Chìa khóa" (useAuth)
// Đây là hook để các component con "mở kho" lấy dữ liệu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
};
