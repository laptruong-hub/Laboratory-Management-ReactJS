import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  FaHome,
  FaUser,
  FaTimes,
  FaBars,
  FaEnvelope,
  FaCalendarCheck,
  FaUsers,
  FaVial,
  FaCalendarAlt,
  FaHistory,
} from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { translateRole } from "@/utils/translations";

const Header: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const normalizedRole = user?.roleName?.trim().toUpperCase() || "";

  // Check if role should hide navbar items
  const shouldHideNavItems =
    !user || // Guest (no user)
    normalizedRole === "PATIENT" ||
    normalizedRole === "USER" ||
    normalizedRole === "GUEST" ||
    normalizedRole === "";

  // Main color in OKLCH format
  const primaryColor = "oklch(0.52 0.2 23.22)";
  const primaryColorHover = "oklch(0.58 0.2 23.22)"; // Lighter for hover
  const primaryColorLight = "oklch(0.95 0.05 23.22)"; // Light version for backgrounds

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableEls = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    // Clear redirect flag để user mới login lại có thể redirect
    sessionStorage.removeItem("hasRedirectedByRole");
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

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-1/2 top-4 z-50 transition-all duration-300 mb-10 mx-auto -translate-x-1/2 flex items-center justify-between",
          scrolled
            ? "max-w-5xl w-[98vw] py-2 px-4 h-[50px] md:h-[56px] shadow-xl bg-white/80 backdrop-blur-xl border border-gray-100 rounded-lg md:rounded-xl"
            : "max-w-6xl w-[99vw] py-2.5 px-6 md:px-10 h-[56px] md:h-[64px] shadow-md bg-white backdrop-blur-xl border border-gray-200 rounded-lg md:rounded-xl"
        )}
      >
        {/* Logo */}
        <div className="logo flex-shrink-0 flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 focus:outline-none cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            <div
              className={cn("rounded-full flex items-center justify-center", scrolled ? "w-9 h-9" : "w-10 h-10")}
              style={{ backgroundColor: primaryColor }}
            >
              <span className={cn("text-white font-bold", scrolled ? "text-xs" : "text-sm")}>LM</span>
            </div>
            <span
              className={cn(
                "font-bold transition-all duration-300",
                scrolled ? "text-sm hidden md:inline" : "text-base hidden md:inline"
              )}
              style={{ color: primaryColor }}
            >
              Quản lý phòng thí nghiệm
            </span>
          </Link>
        </div>

        {/* Navigation Menu - Centered */}
        {!shouldHideNavItems && (
          <nav className="nav-menu hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center justify-center gap-4 list-none m-0 p-0">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                    scrolled ? "drop-shadow-sm" : "",
                    scrolled
                      ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                          isActive("/") ? "text-white" : ""
                        }`
                      : `px-4 py-2.5 rounded-full ${isActive("/") ? "text-white ring-2" : ""}`
                  )}
                  style={{
                    backgroundColor: isActive("/") ? primaryColor : scrolled ? primaryColorLight : "transparent",
                    color: isActive("/") ? "white" : primaryColor,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive("/")) {
                      e.currentTarget.style.backgroundColor = primaryColorHover;
                      e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive("/")) {
                      e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                      e.currentTarget.style.color = primaryColor;
                    }
                  }}
                >
                  <FaHome className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                  {!scrolled && <span className="ml-2">Trang chủ</span>}
                </Link>
              </li>

              {/* Role-based navigation items */}
              {/* Receptionist navigation */}
              {normalizedRole === "RECEPTIONIST" && (
                <>
                  <li>
                    <Link
                      to="/receptionist/patient-requests"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                        scrolled ? "drop-shadow-sm" : "",
                        scrolled
                          ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                              isActive("/receptionist/patient-requests") ? "text-white" : ""
                            }`
                          : `px-4 py-2.5 rounded-full ${
                              isActive("/receptionist/patient-requests") ? "text-white ring-2" : ""
                            }`
                      )}
                      style={{
                        backgroundColor: isActive("/receptionist/patient-requests")
                          ? primaryColor
                          : scrolled
                          ? primaryColorLight
                          : "transparent",
                        color: isActive("/receptionist/patient-requests") ? "white" : primaryColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive("/receptionist/patient-requests")) {
                          e.currentTarget.style.backgroundColor = primaryColorHover;
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive("/receptionist/patient-requests")) {
                          e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                          e.currentTarget.style.color = primaryColor;
                        }
                      }}
                    >
                      <FaEnvelope className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                      {!scrolled && <span className="ml-2">Yêu cầu</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/receptionist/schedule-appointment"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                        scrolled ? "drop-shadow-sm" : "",
                        scrolled
                          ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                              isActive("/receptionist/schedule-appointment") ? "text-white" : ""
                            }`
                          : `px-4 py-2.5 rounded-full ${
                              isActive("/receptionist/schedule-appointment") ? "text-white ring-2" : ""
                            }`
                      )}
                      style={{
                        backgroundColor: isActive("/receptionist/schedule-appointment")
                          ? primaryColor
                          : scrolled
                          ? primaryColorLight
                          : "transparent",
                        color: isActive("/receptionist/schedule-appointment") ? "white" : primaryColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive("/receptionist/schedule-appointment")) {
                          e.currentTarget.style.backgroundColor = primaryColorHover;
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive("/receptionist/schedule-appointment")) {
                          e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                          e.currentTarget.style.color = primaryColor;
                        }
                      }}
                    >
                      <FaCalendarCheck className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                      {!scrolled && <span className="ml-2">Đặt lịch</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/receptionist/patients"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                        scrolled ? "drop-shadow-sm" : "",
                        scrolled
                          ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                              isActive("/receptionist/patients") ? "text-white" : ""
                            }`
                          : `px-4 py-2.5 rounded-full ${isActive("/receptionist/patients") ? "text-white ring-2" : ""}`
                      )}
                      style={{
                        backgroundColor: isActive("/receptionist/patients")
                          ? primaryColor
                          : scrolled
                          ? primaryColorLight
                          : "transparent",
                        color: isActive("/receptionist/patients") ? "white" : primaryColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive("/receptionist/patients")) {
                          e.currentTarget.style.backgroundColor = primaryColorHover;
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive("/receptionist/patients")) {
                          e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                          e.currentTarget.style.color = primaryColor;
                        }
                      }}
                    >
                      <FaUsers className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                      {!scrolled && <span className="ml-2">Bệnh nhân</span>}
                    </Link>
                  </li>
                </>
              )}

              {/* Lab User navigation */}
              {(normalizedRole === "LAB USER" ||
                normalizedRole === "TECHNICIAN" ||
                normalizedRole === "LABUSER" ||
                normalizedRole === "LABORATORY MANAGER" ||
                normalizedRole === "LAB MANAGER") && (
                <>
                  <li>
                    <Link
                      to="/lab-user/dashboard"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                        scrolled ? "drop-shadow-sm" : "",
                        scrolled
                          ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                              isActive("/lab-user/dashboard") ? "text-white" : ""
                            }`
                          : `px-4 py-2.5 rounded-full ${isActive("/lab-user/dashboard") ? "text-white ring-2" : ""}`
                      )}
                      style={{
                        backgroundColor: isActive("/lab-user/dashboard")
                          ? primaryColor
                          : scrolled
                          ? primaryColorLight
                          : "transparent",
                        color: isActive("/lab-user/dashboard") ? "white" : primaryColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive("/lab-user/dashboard")) {
                          e.currentTarget.style.backgroundColor = primaryColorHover;
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive("/lab-user/dashboard")) {
                          e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                          e.currentTarget.style.color = primaryColor;
                        }
                      }}
                    >
                      <FaVial className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                      {!scrolled && <span className="ml-2">Xét nghiệm</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lab-user/work-schedule"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                        scrolled ? "drop-shadow-sm" : "",
                        scrolled
                          ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                              isActive("/lab-user/work-schedule") ? "text-white" : ""
                            }`
                          : `px-4 py-2.5 rounded-full ${isActive("/lab-user/work-schedule") ? "text-white ring-2" : ""}`
                      )}
                      style={{
                        backgroundColor: isActive("/lab-user/work-schedule")
                          ? primaryColor
                          : scrolled
                          ? primaryColorLight
                          : "transparent",
                        color: isActive("/lab-user/work-schedule") ? "white" : primaryColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive("/lab-user/work-schedule")) {
                          e.currentTarget.style.backgroundColor = primaryColorHover;
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive("/lab-user/work-schedule")) {
                          e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                          e.currentTarget.style.color = primaryColor;
                        }
                      }}
                    >
                      <FaCalendarAlt className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                      {!scrolled && <span className="ml-2">Lịch làm việc</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lab-user/history"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                        scrolled ? "drop-shadow-sm" : "",
                        scrolled
                          ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                              isActive("/lab-user/history") ? "text-white" : ""
                            }`
                          : `px-4 py-2.5 rounded-full ${isActive("/lab-user/history") ? "text-white ring-2" : ""}`
                      )}
                      style={{
                        backgroundColor: isActive("/lab-user/history")
                          ? primaryColor
                          : scrolled
                          ? primaryColorLight
                          : "transparent",
                        color: isActive("/lab-user/history") ? "white" : primaryColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive("/lab-user/history")) {
                          e.currentTarget.style.backgroundColor = primaryColorHover;
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive("/lab-user/history")) {
                          e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                          e.currentTarget.style.color = primaryColor;
                        }
                      }}
                    >
                      <FaHistory className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                      {!scrolled && <span className="ml-2">Lịch sử</span>}
                    </Link>
                  </li>
                  {/* Lab Manager specific: Quản lý lịch làm việc */}
                  {(normalizedRole === "LABORATORY MANAGER" || normalizedRole === "LAB MANAGER") && (
                    <li>
                      <Link
                        to="/admin/work-slots"
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer",
                          scrolled ? "drop-shadow-sm" : "",
                          scrolled
                            ? `w-12 h-12 rounded-full hover:scale-110 flex items-center justify-center ${
                                isActive("/admin/work-slots") ? "text-white" : ""
                              }`
                            : `px-4 py-2.5 rounded-full ${isActive("/admin/work-slots") ? "text-white ring-2" : ""}`
                        )}
                        style={{
                          backgroundColor: isActive("/admin/work-slots")
                            ? primaryColor
                            : scrolled
                            ? primaryColorLight
                            : "transparent",
                          color: isActive("/admin/work-slots") ? "white" : primaryColor,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive("/admin/work-slots")) {
                            e.currentTarget.style.backgroundColor = primaryColorHover;
                            e.currentTarget.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive("/admin/work-slots")) {
                            e.currentTarget.style.backgroundColor = scrolled ? primaryColorLight : "transparent";
                            e.currentTarget.style.color = primaryColor;
                          }
                        }}
                      >
                        <FaCalendarAlt className={scrolled ? "w-6 h-6" : "w-5 h-5"} />
                        {!scrolled && <span className="ml-2">Quản lý lịch làm việc</span>}
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </nav>
        )}

        {/* User Menu */}
        <div className="user-menu flex items-center gap-2 ml-auto">
          {loading ? (
            <span className="text-sm" style={{ color: primaryColor }}>
              Đang tải...
            </span>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "rounded-full  text-white flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none relative group cursor-pointer",
                    scrolled ? "w-9 h-9" : "w-10 h-10"
                  )}
                  style={{
                    backgroundColor: primaryColor,
                  }}
                  aria-label="Menu người dùng"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColorHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                >
                  <FaUser className={scrolled ? "w-4 h-4" : "w-5 h-5"} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 p-0 rounded-2xl shadow-2xl border-0 overflow-hidden bg-white"
              >
                <div className="py-2">
                  {/* User Info Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b bg-gray-50">
                    <div
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
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-gray-900 text-base truncate">
                        {user.fullName || "Người dùng"}
                      </span>
                      <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit mt-1">
                        {translateRole(user.roleName)}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <DropdownMenuItem
                    onClick={() => navigate("/user/profile")}
                    className="flex items-center gap-2 px-5 py-3 text-gray-900 hover:bg-gray-50 cursor-pointer"
                  >
                    <FaUser className="w-4 h-4" />
                    Tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex items-center gap-2 px-5 py-3 hover:bg-red-50 cursor-pointer"
                    style={{ color: primaryColor }}
                  >
                    <FaTimes className="w-4 h-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth/login"
                className={cn(
                  "rounded-lg text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center",
                  scrolled ? "px-2.5 py-1 text-sm" : "px-3 py-2 text-md"
                )}
                style={{
                  backgroundColor: primaryColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColorHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                }}
              >
                Đăng nhập
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {!shouldHideNavItems && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 h-9 flex items-center justify-center"
              style={{
                color: primaryColor,
              }}
              aria-label="Mở menu"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColorLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FaBars className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-85 max-w-sm h-full bg-white shadow-2xl z-50 flex flex-col overflow-y-auto md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu di động"
            >
              {/* Menu Header */}
              <div
                className="text-white px-6 py-5 flex items-center justify-between"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorHover} 100%)`,
                }}
              >
                <h3 className="text-xl font-bold">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Đóng menu"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col flex-1">
                {!shouldHideNavItems && (
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-5 text-gray-900 font-medium border-b border-gray-100 transition-all duration-200",
                      isActive("/") ? "border-l-4" : "hover:bg-gray-50"
                    )}
                    style={{
                      backgroundColor: isActive("/") ? primaryColorLight : undefined,
                      color: isActive("/") ? primaryColor : undefined,
                      borderLeftColor: isActive("/") ? primaryColor : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive("/")) {
                        e.currentTarget.style.color = primaryColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive("/")) {
                        e.currentTarget.style.color = "#111827";
                      }
                    }}
                  >
                    <FaHome className="w-5 h-5" />
                    <span>Trang chủ</span>
                  </Link>
                )}

                {user ? (
                  <>
                    <Link
                      to="/user/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-6 py-5 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      style={{ "--hover-color": primaryColor } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#111827";
                      }}
                    >
                      <FaUser className="w-5 h-5" />
                      <span>Tài khoản</span>
                    </Link>
                    <div className="mt-auto border-t border-gray-200">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-6 py-5 font-medium hover:bg-red-50 transition-all duration-200"
                        style={{ color: primaryColor }}
                      >
                        <FaTimes className="w-5 h-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-6 py-5 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#111827";
                      }}
                    >
                      <FaUser className="w-5 h-5" />
                      <span>Đăng nhập</span>
                    </Link>
                    <Link
                      to="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mx-4 mt-4 mb-6 flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorHover} 100%)`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColorHover} 0%, oklch(0.47 0.15 19.26) 100%)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorHover} 100%)`;
                      }}
                    >
                      <span>Đăng ký</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
