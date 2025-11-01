import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { apiPublic } from "../../api/apiClient";

const StyledNavbar = styled(Navbar)`
  .btn {
    margin-right: 5px;
    font-size: 10px;                 
    padding: 5px 30px;               
    border-radius: 8px; 
    border: 2px solid #cbabab59;
    &:hover {
      background-color: #f99f9fff;
      color: #ffffff !important;
      opacity: 0.75;
    }
  }
  .navbar-brand {
    font-size: 1.2rem;
    font-weight: 600;
  }
  .nav-link {
    transition: opacity 0.2s ease-in-out;
    &:hover {
      color: #ffffff !important;
      opacity: 0.75;
    }
  }
  .nav-link[href="/auth/login"] {
    font-weight: 600;
  }
  .nav-link[href="/auth/signup"] {
    font-weight: 600;
  }
  
  /* Thêm style cho text "Xin chào" */
  .navbar-text {
    color: rgba(255, 255, 255, 0.8) !important;
    margin-right: 15px;
    font-size: 0.9rem;
  }
`;

const Header: React.FC = () => {
  // 2. MỞ "KHO" ĐỂ LẤY DỮ LIỆU
  const { user, loading } = useAuth();

  // 3. ĐỊNH NGHĨA HÀM LOGOUT
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiPublic.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      // Luôn xóa token ở FE và tải lại trang để reset "Kho"
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  };

  return (
    <StyledNavbar bg="danger" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Quản lý phòng thí nghiệm
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Trang chủ
            </Nav.Link>
            {/* Bạn có thể thêm link admin ở đây nếu user.roleName == 'ADMIN' */}
          </Nav>

          {/* 4. LOGIC HIỂN THỊ ĐỘNG (THAY ĐỔI TẠI ĐÂY) */}
          <Nav>
            {loading ? (
              // Nếu đang tải (check token), hiển thị "Đang tải..."
              <Navbar.Text>Đang tải...</Navbar.Text>
            ) : user ? (
              // Nếu ĐÃ ĐĂNG NHẬP (user tồn tại)
              <>
                <Navbar.Text>
                  Xin chào, {user.fullName || user.email}
                </Navbar.Text>
                <Nav.Link
                  as="button" // Biến nó thành nút bấm
                  onClick={handleLogout}
                  className="btn btn-outline-primary text-white px-2"
                >
                  Đăng xuất
                </Nav.Link>
              </>
            ) : (
              // Nếu LÀ KHÁCH (user là null)
              <>
                <Nav.Link
                  as={Link}
                  to="/auth/login"
                  className="btn btn-outline-primary text-white px-2"
                >
                  Đăng nhập
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/auth/signup"
                  className="btn btn-outline-primary text-white px-2"
                >
                  Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;