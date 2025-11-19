import React, { useState } from "react";
import loginImg from "../../assets/img/login.jpg";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiPublic } from "../../api/apiClient.ts";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiPublic.post("/api/auth/login", {
        email: email,
        password: password,
      });

      // 2b. Lấy CẢ HAI token
      if (response.data && response.data.accessToken) {
        const { accessToken, refreshToken } = response.data;

        // 2c. LƯU CẢ HAI token
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Refresh user data and navigate
        navigate("/", { replace: true });
        window.location.reload(); // Reload to refresh auth context
      } else {
        // Nếu BE trả về 200 OK nhưng không có token thì coi như lỗi
        setError("Lỗi đăng nhập không mong muốn.");
      }
    } catch (err: any) {
      // 2d. Sửa lại hàm check lỗi
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Email hoặc mật khẩu không chính xác.");
      } else {
        setError("Đăng nhập thất bại, không thể kết nối tới server.");
      }
      // Error logged for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Đăng nhập với Google");
  };

  return (
    <div style={styles.authContent}>
      <div style={styles.side}>
        <div style={styles.sideInfor}>
          <img src={loginImg} alt="Picture" style={{ width: "360px", marginBottom: "10px", borderRadius: "10px" }} />

          <div style={styles.sideTitles}>
            <h2 style={styles.sideTitleH2}>Phòng Lab Xét Nghiệm Máu</h2>
            <p style={styles.sideTitleP}>Nơi cung cấp kết quả chính xác và nhanh chóng</p>
            <p> giúp bạn theo dõi sức khỏe hiệu quả mỗi ngày.</p>
          </div>

          <div style={styles.sideAddress}>
            <div style={styles.contactItem}>
              <FaMapMarkerAlt style={styles.icon} />
              <span>123 Đường ABC, Quận 1, TP.HCM</span>
            </div>
            <div style={styles.contactItem}>
              <FaPhoneAlt style={styles.icon} />
              <span>1900 xxxx</span>
            </div>
            <div style={styles.contactItem}>
              <FaEnvelope style={styles.icon} />
              <span>info@labxetnghiem.vn</span>
            </div>
          </div>
        </div>
      </div>
      <div style={styles.loginCard}>
        <div style={styles.loginIcon}>
          <div style={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="4" width="16" height="24" rx="2" stroke="#FF0000" strokeWidth="2" fill="white" />
              <rect x="12" y="8" width="8" height="1" fill="#FF0000" />
              <rect x="12" y="11" width="8" height="1" fill="#FF0000" />
              <rect x="12" y="14" width="8" height="1" fill="#FF0000" />
            </svg>
          </div>
        </div>

        <h1 style={styles.loginTitle}>
          Hệ Thống Quản Lý
          <br />
          Phòng Xét Nghiệm
        </h1>

        <p style={styles.loginSubtitle}>Chào mừng trở lại</p>
        <p style={styles.loginDescription}>Đăng nhập để tiếp tục</p>

        <form onSubmit={handleLogin} style={styles.loginForm}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email *
            </label>
            <div style={styles.inputWrapper}>
              <input
                id="email"
                type="email"
                placeholder="email@benhvien.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Mật khẩu *
            </label>
            <div style={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button type="button" style={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={styles.formOptions}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="/auth/forgot-password" style={styles.forgotLink}>
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" style={styles.loginButton} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerSpan}>Hoặc đăng nhập với</span>
          </div>

          <button type="button" style={styles.googleButton} onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
              />
            </svg>
            Đăng nhập với Google
          </button>

          <div style={styles.signupLink}>
            Chưa có tài khoản?{" "}
            <a href="/auth/signup" style={styles.signupLinkA}>
              Đăng ký ngay
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  authContent: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fce4e4 0%, #f8d7da 50%, #fadbd8 100%)",
  },
  loginCard: {
    marginTop: "50px",
    marginBottom: "50px",
    background: "white",
    borderRadius: "12px",
    padding: "40px",
    width: "500px",
    maxWidth: "400px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
  },

  contactItem: {
    display: "flex",
    gap: "8px",
    marginBottom: "6px",
  },
  icon: {
    color: "#d32f2f",
  },
  sideAddress: {
    fontWeight: "500",
    lineHeight: "0.2",
    paddingLeft: "10px",
  },

  side: {
    marginTop: "80px",
    marginBottom: "430px",
    marginRight: "30px",
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
  },

  sideTitleH2: {
    paddingLeft: "60px",
    fontSize: "18px",
    color: "#c00",
    fontWeight: "600",
    marginBottom: "8px",
  },
  sideTitleP: {
    paddingLeft: "10px",
    fontSize: "16px",
    color: "#333",
    margin: "0",
    lineHeight: "1",
  },

  loginIcon: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  iconWrapper: {
    width: "56px",
    height: "56px",
    background: "#fff5f5",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginTitle: {
    textAlign: "center" as const,
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: "1.4",
    margin: "0 0 12px 0",
  },
  loginSubtitle: {
    textAlign: "center" as const,
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
    margin: "0 0 4px 0",
  },
  loginDescription: {
    textAlign: "center" as const,
    fontSize: "13px",
    color: "#666",
    margin: "0 0 32px 0",
  },
  loginForm: {
    width: "100%",
  },
  errorMessage: {
    background: "#fee",
    border: "1px solid #fcc",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "20px",
    color: "#c00",
    fontSize: "14px",
    textAlign: "center" as const,
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "8px",
  },
  inputWrapper: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "12px 44px 12px 14px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s",
    outline: "none",
    background: "white",
    color: "#333",
    boxSizing: "border-box" as const,
  },
  togglePassword: {
    position: "absolute" as const,
    right: "14px",
    background: "none",
    border: "none",
    color: "#999",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
  },
  formOptions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    fontSize: "13px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    color: "#666",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#ff0000",
  },
  forgotLink: {
    color: "#ff0000",
    textDecoration: "none",
    fontWeight: "500",
    transition: "opacity 0.2s",
  },
  loginButton: {
    width: "100%",
    padding: "14px",
    background: "#ff0000",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: "20px",
  },
  divider: {
    position: "relative" as const,
    textAlign: "center" as const,
    margin: "24px 0",
    height: "1px",
    background: "#e0e0e0",
  },
  dividerSpan: {
    position: "relative" as const,
    background: "white",
    padding: "0 16px",
    fontSize: "13px",
    color: "#999",
    top: "-10px",
  },
  googleButton: {
    width: "100%",
    padding: "12px",
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.2s",
    marginBottom: "20px",
  },
  signupLink: {
    textAlign: "center" as const,
    fontSize: "13px",
    color: "#666",
  },
  signupLinkA: {
    color: "#ff0000",
    textDecoration: "none",
    fontWeight: "600",
    transition: "opacity 0.2s",
  },
};

export default Login;
