import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaCog,
  FaChartBar,
  FaSignOutAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaFlask,
  FaCalendarCheck,
  FaVial,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

const primaryColor = "oklch(0.52 0.2 23.22)";
const primaryColorLight = "oklch(0.95 0.05 23.22)";

const WorkingSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="flex-1 overflow-y-auto py-4 bg-white">
      {/* Quản lý hệ thống */}
      <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">
        Quản lý hệ thống
      </h4>
      <nav className="flex flex-col gap-1 p-2">
        <NavLink
          to="/admin/admin-dashboard"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/admin-dashboard")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/admin-dashboard")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : ({
                  "--hover-color": primaryColor,
                } as React.CSSProperties)
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/admin-dashboard")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/admin-dashboard")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaChartBar className="text-xl flex-shrink-0" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/account"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/account")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/account")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/account")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/account")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaUsers className="text-xl flex-shrink-0" />
          <span>Danh sách tài khoản</span>
        </NavLink>

        <NavLink
          to="/admin/roles"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/roles")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/roles")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/roles")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/roles")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaUserShield className="text-xl flex-shrink-0" />
          <span>Quản lý vai trò</span>
        </NavLink>

        <NavLink
          to="/admin/patients"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/patients")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/patients")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/patients")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/patients")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaUsers className="text-xl flex-shrink-0" />
          <span>Danh sách bệnh nhân</span>
        </NavLink>

        <NavLink
          to="/admin/patient-requests"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/patient-requests")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/patient-requests")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/patient-requests")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/patient-requests")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaEnvelope className="text-xl flex-shrink-0" />
          <span>Danh sách yêu cầu</span>
        </NavLink>

        <NavLink
          to="/receptionist/patient-requests"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/receptionist/patient-requests")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/receptionist/patient-requests")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/receptionist/patient-requests")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/receptionist/patient-requests")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaCalendarCheck className="text-xl flex-shrink-0" />
          <span>Đặt lịch khám</span>
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-3" />

      {/* Quản lý xét nghiệm */}
      <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">
        Quản lý xét nghiệm
      </h4>
      <nav className="flex flex-col gap-1 p-2">
        <NavLink
          to="/admin/test-order"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/test-order")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/test-order")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/test-order")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/test-order")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaFlask className="text-xl flex-shrink-0" />
          <span>Danh sách xét nghiệm</span>
        </NavLink>

        <NavLink
          to="/lab-user/dashboard"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/lab-user/dashboard")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/lab-user/dashboard")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/lab-user/dashboard")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/lab-user/dashboard")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaVial className="text-xl flex-shrink-0" />
          <span>Tạo kết quả xét nghiệm</span>
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-3" />

      {/* Quản lý lịch làm việc */}
      <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">
        Quản lý lịch làm việc
      </h4>
      <nav className="flex flex-col gap-1 p-2">
        <NavLink
          to="/admin/work-slots"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/work-slots")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/work-slots")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/work-slots")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/work-slots")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaCalendarAlt className="text-xl flex-shrink-0" />
          <span>Lịch làm việc bác sĩ</span>
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-3" />

      {/* Cài đặt */}
      <h4 className="px-6 py-2 m-0 text-xs uppercase text-gray-400 font-semibold tracking-wider">
        Cài đặt
      </h4>
      <nav className="flex flex-col gap-1 p-2">
        <NavLink
          to="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-[0.95rem] font-medium transition-all duration-200 cursor-pointer",
            isActive("/admin/settings")
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          )}
          style={
            isActive("/admin/settings")
              ? ({
                  backgroundColor: primaryColorLight,
                  color: primaryColor,
                } as React.CSSProperties)
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive("/admin/settings")) {
              e.currentTarget.style.color = primaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/settings")) {
              e.currentTarget.style.color = "";
            }
          }}
        >
          <FaCog className="text-xl flex-shrink-0" />
          <span>Cài đặt</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default WorkingSidebar;
//commit
