import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Quản lý phòng thí nghiệm</Link>
      </div>
      <nav className="nav-menu">
        <ul>
          <li><Link to="/">Trang chủ</Link></li>
          {/* Thêm các liên kết điều hướng khác khi cần */}
        </ul>
      </nav>
      <div className="user-menu">
        <Link to="/auth/login">Đăng nhập</Link>
      </div>
    </header>
  );
};

export default Header;