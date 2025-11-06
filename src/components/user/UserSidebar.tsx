import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    smsNotifications: true,
    showStatus: true,
    autoUpdate: false,
    logoutOtherDevices: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      style={{
        width: "320px",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E6E6E6",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* User Info Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingBottom: "24px",
          borderBottom: "1px solid #EDEDED",
        }}
      >
        <div className="user-avatar">
          <div
            style={{
              width: "112px",
              height: "112px",
              borderRadius: "50%",
              background: "rgba(255, 0, 51, 0.1)",
              border: "4px solid rgba(255, 0, 51, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "26.6px",
                fontWeight: 600,
                color: "#FF0033",
              }}
            >
              LV
            </span>
          </div>
        </div>
        <div className="user-details">
          <h2
            style={{
              fontSize: "18.9px",
              fontWeight: 700,
              color: "#333333",
              margin: "0 0 8px 0",
            }}
          >
            Lê Việt
          </h2>
          <div
            style={{
              backgroundColor: "#F5F5F5",
              padding: "2.8px 10.8px",
              borderRadius: "9999px",
              fontSize: "11.6px",
              fontWeight: 600,
              color: "#333333",
              marginBottom: "16px",
            }}
          >
            <span>Lab User</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              📧
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#737373",
              }}
            >
              teststaff@gmail.com
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              📞
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#737373",
              }}
            >
              0912345678
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              🆔
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#737373",
              }}
            >
              ID: 12345678
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              📅
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#737373",
              }}
            >
              Thành viên từ 04/03/2025
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "18px" }}>📋</span>
          <h3
            style={{
              fontSize: "13.2px",
              fontWeight: 600,
              color: "#333333",
              margin: 0,
            }}
          >
            Menu
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Link
            to="/user"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              color: location.pathname === "/user" ? "#DC2626" : "#374151",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s",
              backgroundColor:
                location.pathname === "/user" ? "#FEF2F2" : "transparent",
              borderLeft:
                location.pathname === "/user"
                  ? "3px solid #DC2626"
                  : "3px solid transparent",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                width: "20px",
                textAlign: "center",
              }}
            >
              👤
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Hồ sơ cá nhân
            </span>
          </Link>
        </div>
      </div>

      {/* Quick Settings Section */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "18px" }}>⚙️</span>
          <h3
            style={{
              fontSize: "13.2px",
              fontWeight: 600,
              color: "#333333",
              margin: 0,
            }}
          >
            Cài đặt nhanh
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "13.3px",
                  fontWeight: 600,
                  color: "#262626",
                  marginBottom: "4px",
                }}
              >
                Thông báo SMS
              </div>
              <div
                style={{
                  fontSize: "11.1px",
                  color: "#737373",
                }}
              >
                Nhận SMS về kết quả
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "44px",
                height: "24px",
              }}
            >
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() => toggleSetting("smsNotifications")}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.smsNotifications
                    ? "#FF0033"
                    : "#E6E6E6",
                  transition: ".4s",
                  borderRadius: "24px",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  content: '""',
                  height: "20px",
                  width: "20px",
                  left: "1.6px",
                  bottom: "1.6px",
                  backgroundColor: "#FAFAFA",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: ".4s",
                  borderRadius: "50%",
                  transform: settings.smsNotifications
                    ? "translateX(20px)"
                    : "translateX(0)",
                }}
              ></span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "13.3px",
                  fontWeight: 600,
                  color: "#262626",
                  marginBottom: "4px",
                }}
              >
                Hiển thị trạng thái
              </div>
              <div
                style={{
                  fontSize: "11.1px",
                  color: "#737373",
                }}
              >
                Trạng thái online
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "44px",
                height: "24px",
              }}
            >
              <input
                type="checkbox"
                checked={settings.showStatus}
                onChange={() => toggleSetting("showStatus")}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.showStatus ? "#FF0033" : "#E6E6E6",
                  transition: ".4s",
                  borderRadius: "24px",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  content: '""',
                  height: "20px",
                  width: "20px",
                  left: "1.6px",
                  bottom: "1.6px",
                  backgroundColor: "#FAFAFA",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: ".4s",
                  borderRadius: "50%",
                  transform: settings.showStatus
                    ? "translateX(20px)"
                    : "translateX(0)",
                }}
              ></span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "13.3px",
                  fontWeight: 600,
                  color: "#262626",
                  marginBottom: "4px",
                }}
              >
                Tự động cập nhật
              </div>
              <div
                style={{
                  fontSize: "11.1px",
                  color: "#737373",
                }}
              >
                Cập nhật hệ thống
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "44px",
                height: "24px",
              }}
            >
              <input
                type="checkbox"
                checked={settings.autoUpdate}
                onChange={() => toggleSetting("autoUpdate")}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.autoUpdate ? "#FF0033" : "#E6E6E6",
                  transition: ".4s",
                  borderRadius: "24px",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  content: '""',
                  height: "20px",
                  width: "20px",
                  left: "1.6px",
                  bottom: "1.6px",
                  backgroundColor: "#FAFAFA",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: ".4s",
                  borderRadius: "50%",
                  transform: settings.autoUpdate
                    ? "translateX(20px)"
                    : "translateX(0)",
                }}
              ></span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "13.3px",
                  fontWeight: 600,
                  color: "#262626",
                  marginBottom: "4px",
                }}
              >
                Đăng xuất thiết bị khác
              </div>
              <div
                style={{
                  fontSize: "11.1px",
                  color: "#737373",
                }}
              >
                Bảo mật tài khoản
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "44px",
                height: "24px",
              }}
            >
              <input
                type="checkbox"
                checked={settings.logoutOtherDevices}
                onChange={() => toggleSetting("logoutOtherDevices")}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.logoutOtherDevices
                    ? "#FF0033"
                    : "#E6E6E6",
                  transition: ".4s",
                  borderRadius: "24px",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  content: '""',
                  height: "20px",
                  width: "20px",
                  left: "1.6px",
                  bottom: "1.6px",
                  backgroundColor: "#FAFAFA",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: ".4s",
                  borderRadius: "50%",
                  transform: settings.logoutOtherDevices
                    ? "translateX(20px)"
                    : "translateX(0)",
                }}
              ></span>
            </div>
          </div>
        </div>

        {/* Logout Button under Settings */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #EDEDED",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 16px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#FF0033",
              color: "#FFFFFF",
              fontSize: "13.3px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 1px 3px rgba(255, 0, 51, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E00030";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(255, 0, 51, 0.35)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FF0033";
              e.currentTarget.style.boxShadow =
                "0 1px 3px rgba(255, 0, 51, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: "14px" }}>🚪</span>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Account Actions Section */}
      <div
        style={{
          borderTop: "1px solid #EDEDED",
          paddingTop: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            border: "1px solid #E6E6E6",
            borderRadius: "6px",
            backgroundColor: "#FAFAFA",
            color: "#262626",
            fontSize: "13.3px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          <span style={{ fontSize: "12px" }}>←</span>
          Về trang nhân viên
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            border: "1px solid #E6E6E6",
            borderRadius: "6px",
            backgroundColor: "#FAFAFA",
            color: "#262626",
            fontSize: "13.3px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          <span style={{ fontSize: "12px" }}>→</span>
          Đăng xuất
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            border: "1px solid #E6E6E6",
            borderRadius: "6px",
            backgroundColor: "#FAFAFA",
            color: "#EF4343",
            fontSize: "13.3px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={handleLogout}
        >
          <span style={{ fontSize: "12px" }}>🗑️</span>
          Xóa tài khoản
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
