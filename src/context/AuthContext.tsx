import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '../api/apiClient'; // Import trạm API

// 1. Định nghĩa "kiểu" của User (hoặc dùng "any" nếu lười)
interface User {
    id: number;
    email: string;
    fullName: string;
    roleName: string;
    // (Thêm các trường khác nếu cần)
}

// 2. Định nghĩa "kiểu" của Kho (Context)
interface AuthContextType {
    user: User | null;       // Thông tin user (hoặc null nếu là khách)
    loading: boolean;        // Trạng thái đang tải
    isAuthenticated: boolean; // Đã đăng nhập hay chưa?
}

// 3. Tạo "Kho"
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Tạo "Người Quản Lý Kho" (AuthProvider)
// Đây là component sẽ fetch API và cung cấp dữ liệu
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Bắt đầu là "true"

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const response = await apiClient.get('/api/users/me');
                setUser(response.data); // Lưu user vào kho
            } catch (error) {
                console.error("AuthContext: Không thể fetch user", error);
                // Nếu lỗi (ví dụ 401), user sẽ vẫn là null
            } finally {
                setLoading(false); // Xong, tắt loading
            }
        };

        // Kiểm tra xem có token không
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchMyProfile(); // Nếu có token -> mới fetch
        } else {
            setLoading(false); // Nếu không có token -> Khách -> Tắt loading
        }
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated: !!user, // Nếu "user" có dữ liệu -> true
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 5. Tạo "Chìa khóa" (useAuth)
// Đây là hook để các component con "mở kho" lấy dữ liệu
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth phải được dùng bên trong AuthProvider');
    }
    return context;
};