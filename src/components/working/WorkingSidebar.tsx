import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  FaUsers,
  FaUserShield,
  FaFlask,
  FaCog,
  FaChartBar,
  FaSignOutAlt,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const SidebarContainer = styled.div`
  flex: 1;
  overflow-y: auto;

  padding: 1rem 0;
  background-color: #ffffff;
`;

const SidebarTitle = styled.h4`
  padding: 0.5rem 1.5rem;
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
    color: #dc2626;
  }

  &.active {
    background-color: #fee2e2;
    color: #dc2626;
    font-weight: 600;
  }

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: #dc2626;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.75rem 0;
`;

const WorkingSidebar: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarContainer>
      <SidebarTitle>Quản lý hệ thống</SidebarTitle>
      <NavList>
        <NavItem to="/admin/admin-dashboard">
          <FaChartBar />
          <span>Dashboard</span>
        </NavItem>

        <NavItem to="/admin/account">
          <FaUsers />
          <span>Danh sách tài khoản</span>
        </NavItem>

        <NavItem to="/admin/roles">
          <FaUserShield />
          <span>Quản lý vai trò</span>
        </NavItem>

        <NavItem to="/admin/patients">
          <FaUsers />
          <span>Danh sách bệnh nhân</span>
        </NavItem>

        <NavItem to="/admin/patient-requests">
          <FaEnvelope />
          <span>Danh sách yêu cầu</span>
        </NavItem>
      </NavList>
      <Divider />
      <SidebarTitle>Quản lý xét nghiệm</SidebarTitle>
      <NavList>
        <NavItem to="/admin/test-order">
          <FaFlask />
          <span>Danh sách xét nghiệm</span>
        </NavItem>
      </NavList>
      <Divider />
      <SidebarTitle>Quản lý lịch làm việc</SidebarTitle>
      <NavList>
        <NavItem to="/admin/work-slots">
          <FaCalendarAlt />
          <span>Lịch làm việc bác sĩ</span>
        </NavItem>
      </NavList>
      <Divider />
      <SidebarTitle>Cài đặt</SidebarTitle>
      <NavList>
        <NavItem to="/working/settings">
          <FaCog />
          <span>Cài đặt</span>
        </NavItem>
      </NavList>
      <Divider />
      <NavList>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </LogoutButton>
      </NavList>
    </SidebarContainer>
  );
};

export default WorkingSidebar;
//commit
