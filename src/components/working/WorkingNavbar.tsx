import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaTimes, FaChartBar, FaUsers, FaUserShield, FaCalendarAlt, FaCog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const WorkingNavbar: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Main color in OKLCH format
  const primaryColor = "oklch(0.52 0.2 23.22)";
  const primaryColorHover = "oklch(0.47 0.2 23.22)"; // Slightly darker for hover

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Map pathname to page title and icon
  const getPageInfo = (pathname: string): { title: string; icon: React.ReactNode } => {
    const routeMap: Record<string, { title: string; icon: React.ReactNode }> = {
      "/admin/admin-dashboard": {
        title: "Dashboard",
        icon: <FaChartBar className="w-8 h-8" />,
      },
      "/admin/account": {
        title: "Quản lý tài khoản",
        icon: <FaUsers className="w-8 h-8" />,
      },
      "/admin/roles": {
        title: "Quản lý vai trò",
        icon: <FaUserShield className="w-8 h-8" />,
      },
      "/admin/patients": {
        title: "Quản lý bệnh nhân",
        icon: <FaUsers className="w-8 h-8" />,
      },
      "/admin/work-slots": {
        title: "Quản lý lịch làm việc",
        icon: <FaCalendarAlt className="w-8 h-8" />,
      },
      "/admin/settings": {
        title: "Cài đặt",
        icon: <FaCog className="w-8 h-8" />,
      },
    };

    // Check exact match first
    if (routeMap[pathname]) {
      return routeMap[pathname];
    }

    // Check if pathname starts with any route
    for (const [route, info] of Object.entries(routeMap)) {
      if (pathname.startsWith(route)) {
        return info;
      }
    }

    // Default fallback
    return {
      title: "Dashboard",
      icon: <FaChartBar className="w-6 h-6" />,
    };
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <div className="w-full px-6 pt-6 pb-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "relative z-50 transition-all duration-300 flex items-center justify-between mx-auto",
          "max-w-6xl w-full py-4 px-8 md:px-16 h-[70px] md:h-[80px] shadow-md bg-white backdrop-blur-xl border border-gray-200 rounded-lg md:rounded-2xl"
        )}
      >
        {/* Page Title with Icon */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ color: primaryColor } as React.CSSProperties}
          >
            {pageInfo.icon}
          </motion.div>
          <span
            className="font-bold transition-all duration-300 text-2xl"
            style={{ color: primaryColor } as React.CSSProperties}
          >
            {pageInfo.title}
          </span>
        </div>

        {/* User Menu */}
        <div className="user-menu flex items-center gap-3 ml-auto">
          {loading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
              style={{ color: primaryColor } as React.CSSProperties}
            >
              Đang tải...
            </motion.span>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "rounded-full border-2 border-white text-white flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 relative group cursor-pointer drop-shadow-sm w-14 h-14"
                  )}
                  style={
                    {
                      backgroundColor: primaryColor,
                    } as React.CSSProperties
                  }
                  aria-label="Menu người dùng"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColorHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-7 h-7" />
                  )}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 p-0 rounded-2xl shadow-2xl border-0 overflow-hidden bg-white"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="py-2">
                    {/* User Info Header */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3 px-5 py-4 border-b bg-gray-50"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorHover} 100%)`,
                        }}
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName || "User"}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(user.fullName || user.email)
                        )}
                      </motion.div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-900 text-base truncate">
                          {user.fullName || "Người dùng"}
                        </span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      </div>
                    </motion.div>

                    {/* Menu Items */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                      <DropdownMenuItem
                        onClick={() => navigate("/user/profile")}
                        className="flex items-center gap-2 px-5 py-3 text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                      >
                        <FaUser className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">Tài khoản</span>
                      </DropdownMenuItem>
                    </motion.div>
                    <DropdownMenuSeparator />
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        variant="destructive"
                        className="flex items-center gap-2 px-5 py-3 hover:bg-red-50 cursor-pointer transition-colors duration-200 group"
                        style={{ color: primaryColor }}
                      >
                        <FaTimes className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">Đăng xuất</span>
                      </DropdownMenuItem>
                    </motion.div>
                  </div>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </motion.nav>
    </div>
  );
};

export default WorkingNavbar;
