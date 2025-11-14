import { User, Mail, Phone, CreditCard, Zap, LogOut, DrumIcon, DrillIcon, ListCheckIcon } from 'lucide-react';
import { DiIllustrator } from 'react-icons/di';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <aside style={{
      width: '350px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E5E5E5',
      padding: '24px',
      flexShrink: 0
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: '#FFE7E6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#FF4D4F'
        }}>
          LV
        </div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#262626',
          margin: '0 0 4px 0'
        }}>
          Lê Việt
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#8C8C8C',
          margin: 0
        }}>
          Lab User
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid #E5E5E5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8C8C8C' }}>
          <Mail size={16} />
          <span style={{ fontSize: '14px' }}>teststaff@gmail.com</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8C8C8C' }}>
          <Phone size={16} />
          <span style={{ fontSize: '14px' }}>0912345678</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8C8C8C' }}>
          <CreditCard size={16} />
          <span style={{ fontSize: '14px' }}>ID: 12345678</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8C8C8C' }}>
          <Zap size={16} />
          <span style={{ fontSize: '14px' }}>Thành viên từ 04/03/2025</span>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#262626',
          fontWeight: 500,
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          <User size={16} />
          <span>Menu</span>
        </div>
        <button
          onClick={() => navigate('/user/profile')}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: isActive('/user/profile') ? '#FFE7E6' : 'transparent',
            color: isActive('/user/profile') ? '#FF4D4F' : '#262626',
            textAlign: 'left',
            cursor: 'pointer',
            fontWeight: isActive('/user/profile') ? 500 : 400,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/user/profile')) {
              e.currentTarget.style.backgroundColor = '#FAFAFA';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/user/profile')) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <User size={16} />
          Hồ sơ cá nhân
        </button>

        <button
          onClick={() => navigate('/user/medical')}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: isActive('/user/medical') ? '#FFE7E6' : 'transparent',
            color: isActive('/user/medical') ? '#FF4D4F' : '#262626',
            textAlign: 'left',
            cursor: 'pointer',
            fontWeight: isActive('/user/medical') ? 500 : 400,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/user/medical')) {
              e.currentTarget.style.backgroundColor = '#FAFAFA';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/user/medical')) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <ListCheckIcon size={16} />
          Hồ sơ bệnh án
        </button>
      </div>


      

      <button style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '6px',
        color: '#262626',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.2s'
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
//commit