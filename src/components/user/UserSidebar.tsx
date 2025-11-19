import { User, Mail, Phone, CreditCard, Zap, LogOut, ListCheckIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface UserSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      style={{
        width: "350px",
        maxWidth: "90vw",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E5E5E5",
        padding: "24px",
        flexShrink: 0,
        height: "100%",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            backgroundColor: "#FFE7E6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FF4D4F",
          }}
        >
          {user ? getInitials(user.fullName) : "U"}
        </div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#262626",
            margin: "0 0 4px 0",
          }}
        >
          {user?.fullName || "Người dùng"}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#8C8C8C",
            margin: 0,
          }}
        >
          {user?.roleName || "User"}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "1px solid #E5E5E5",
        }}
      >
        {user?.email && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8C8C8C" }}>
            <Mail size={16} />
            <span style={{ fontSize: "14px" }}>{user.email}</span>
          </div>
        )}
        {user?.id && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8C8C8C" }}>
            <CreditCard size={16} />
            <span style={{ fontSize: "14px" }}>ID: {user.id}</span>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#262626",
            fontWeight: 500,
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          <User size={16} />
          <span>Menu</span>
        </div>
        <button
          onClick={() => handleNavigate("/user/profile")}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: isActive("/user/profile") ? "#FFE7E6" : "transparent",
            color: isActive("/user/profile") ? "#FF4D4F" : "#262626",
            textAlign: "left",
            cursor: "pointer",
            fontWeight: isActive("/user/profile") ? 500 : 400,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isActive("/user/profile")) {
              e.currentTarget.style.backgroundColor = "#FAFAFA";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/user/profile")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <User size={16} />
          Hồ sơ cá nhân
        </button>

        <button
          onClick={() => handleNavigate("/user/medical")}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: isActive("/user/medical") ? "#FFE7E6" : "transparent",
            color: isActive("/user/medical") ? "#FF4D4F" : "#262626",
            textAlign: "left",
            cursor: "pointer",
            fontWeight: isActive("/user/medical") ? 500 : 400,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isActive("/user/medical")) {
              e.currentTarget.style.backgroundColor = "#FAFAFA";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/user/medical")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <ListCheckIcon size={16} />
          Hồ sơ bệnh án
        </button>
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "12px 16px",
          backgroundColor: "transparent",
          border: "none",
          borderRadius: "6px",
          color: "#262626",
          textAlign: "left",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#FAFAFA";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <LogOut size={16} />
        Đăng xuất
      </button>
    </aside>
  );
};

export default UserSidebar;
