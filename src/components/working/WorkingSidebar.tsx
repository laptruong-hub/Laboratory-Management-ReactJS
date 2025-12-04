import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaCog,
  FaChartBar,
  FaCalendarAlt,
  FaEnvelope,
  FaFlask,
  FaCalendarCheck,
  FaVial,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";

const primaryColor = "oklch(0.52 0.2 23.22)";
const primaryColorLight = "oklch(0.95 0.05 23.22)";

const WorkingSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const normalizedRole = user?.roleName?.trim().toUpperCase() || "";
  const isAdmin = normalizedRole === "ADMIN" || normalizedRole === "ADMINISTRATOR";
  // Enhanced receptionist detection - handles variations
  const isReceptionist =
    normalizedRole === "RECEPTIONIST" ||
    normalizedRole === "RECEPTION" ||
    normalizedRole.includes("RECEPTIONIST") ||
    normalizedRole.includes("RECEPTION");
  const isLabUser =
    normalizedRole === "LAB USER" ||
    normalizedRole === "LABUSER" ||
    normalizedRole === "TECHNICIAN" ||
    normalizedRole === "LAB TECHNICIAN";

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const createNavLink = (to: string, icon: React.ReactNode, label: string, show: boolean = true) => {
    if (!show) return null;

    return (
      <NavLink
        key={to}
        to={to}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
          isActive(to) ? "font-semibold" : "text-gray-700 hover:bg-gray-100"
        )}
        style={
          isActive(to)
            ? ({
                backgroundColor: primaryColorLight,
                color: primaryColor,
              } as React.CSSProperties)
            : undefined
        }
        onMouseEnter={(e) => {
          if (!isActive(to)) {
            e.currentTarget.style.color = primaryColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive(to)) {
            e.currentTarget.style.color = "";
          }
        }}
      >
        <span className="text-xl flex-shrink-0">{icon}</span>
        <span>{label}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto py-4 bg-white">
      {/* Receptionist Menu */}
      {isReceptionist && (
        <>
          <nav className="flex flex-col gap-1 p-2">
            {createNavLink("/receptionist/dashboard", <FaChartBar />, "Bảng điều khiển")}
            {createNavLink("/receptionist/patient-requests", <FaEnvelope />, "Danh sách yêu cầu")}
            {createNavLink("/receptionist/schedule-appointment", <FaCalendarCheck />, "Đặt lịch khám")}
            {createNavLink("/receptionist/patients", <FaUsers />, "Danh sách bệnh nhân")}
          </nav>
        </>
      )}

      {/* Lab User Menu */}
      {isLabUser && (
        <>
          <nav className="flex flex-col gap-1 p-2">
            {createNavLink("/lab-user/dashboard", <FaVial />, "Tạo kết quả xét nghiệm")}
            {createNavLink("/lab-user/work-schedule", <FaCalendarAlt />, "Lịch làm việc bác sĩ")}
          </nav>
        </>
      )}

      {/* Admin Menu */}
      {isAdmin && (
        <>
          {/* Quản lý hệ thống */}
          <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">
            Quản lý hệ thống
          </h4>
          <nav className="flex flex-col gap-1 p-2">
            {createNavLink("/admin/admin-dashboard", <FaChartBar />, "Dashboard")}
            {createNavLink("/admin/account", <FaUsers />, "Danh sách tài khoản")}
            {createNavLink("/admin/roles", <FaUserShield />, "Quản lý vai trò")}
            {createNavLink("/admin/patients", <FaUsers />, "Danh sách bệnh nhân")}
            {createNavLink("/admin/patient-requests", <FaEnvelope />, "Danh sách yêu cầu")}
          </nav>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-3" />

          {/* Quản lý xét nghiệm */}
          <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">
            Quản lý xét nghiệm
          </h4>
          <nav className="flex flex-col gap-1 p-2">
            {createNavLink("/admin/test-order", <FaFlask />, "Danh sách xét nghiệm")}
          </nav>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-3" />

          {/* Quản lý lịch làm việc */}
          <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">
            Quản lý lịch làm việc
          </h4>
          <nav className="flex flex-col gap-1 p-2">
            {createNavLink("/admin/work-slots", <FaCalendarAlt />, "Lịch làm việc bác sĩ")}
          </nav>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-3" />

          {/* Cài đặt */}
          <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">Cài đặt</h4>
          <nav className="flex flex-col gap-1 p-2">{createNavLink("/admin/settings", <FaCog />, "Cài đặt")}</nav>
        </>
      )}
    </div>
  );
};

export default WorkingSidebar;
//commit
