import React, { useState, useEffect } from "react";
// import loginImg from "../../assets/img/login.jpg"; // Image file not found - using placeholder
import { Eye, EyeOff } from 'lucide-react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiPublic } from "../../api/apiClient.ts";
import {
  setToken,
  setRememberMe,
  setRememberedEmail,
  getRememberedEmail,
  getRememberMe,
} from "../../utils/storage";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMeState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    const wasRemembered = getRememberMe();

    if (rememberedEmail && wasRemembered) {
      setEmail(rememberedEmail);
      setRememberMeState(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiPublic.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        const { accessToken, refreshToken } = response.data;

        setToken("accessToken", accessToken, rememberMe);
        setToken("refreshToken", refreshToken, rememberMe);

        setRememberMe(rememberMe);
        setRememberedEmail(email, rememberMe);

        navigate("/", { replace: true });
        window.location.reload();
      } else {
        setError("Lỗi đăng nhập không mong muốn.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Email hoặc mật khẩu không chính xác.");
      } else {
        setError("Đăng nhập thất bại, không thể kết nối tới server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.authContent}>
      <div style={styles.loginCard}>
        {/* LEFT SIDE */}
        <div style={styles.side}>
          <div
            style={{
              width: "100%",
              height: "200px",
              borderRadius: "10px",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Laboratory Image
          </div>

          <div>
            <h2 style={styles.sideTitleH2}>Phòng Lab Xét Nghiệm Máu</h2>
            <p style={styles.sideTitleP}>
              Nơi cung cấp kết quả chính xác và nhanh chóng giúp bạn theo dõi sức khỏe hiệu quả.
            </p>
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

        {/* RIGHT SIDE */}
        <div style={styles.formContainer}>
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
                <button
                  type="button"
                  style={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div style={styles.formOptions}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMeState(e.target.checked)}
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

            <div style={styles.signupLink}>
              Chưa có tài khoản?{" "}
              <a href="/auth/signup" style={styles.signupLinkA}>
                Đăng ký ngay
              </a>
            </div>
          </form>
        </div>
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
    padding: "40px",
  },

  loginCard: {
    height: "600px",
    background: "white",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "row",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  },

  side: {
    width: "380px",
    background: "white",
    padding: "30px",
    borderRight: "1px solid #eee",
  },

  sideTitleH2: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#c00",
    marginBottom: "10px",
  },
  sideTitleP: {
    fontSize: "15px",
    color: "#444",
    lineHeight: "1.4",
  },

  sideAddress: {
    marginTop: "20px",
    fontWeight: "500",
    lineHeight: "1.6",
  },

  contactItem: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
    alignItems: "center",
  },
  icon: {
    color: "#d32f2f",
  },

  formContainer: {
    flex: 1,
    padding: "40px 50px",
    background: "white",
  },

  loginTitle: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  loginSubtitle: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "4px",
  },
  loginDescription: {
    textAlign: "center",
    fontSize: "13px",
    marginBottom: "30px",
    color: "#666",
  },

  loginForm: {
    width: "100%",
  },

  errorMessage: {
    background: "#fee",
    border: "1px solid #fcc",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    color: "#c00",
    fontSize: "14px",
    marginBottom: "20px",
  },

  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontWeight: "500",
    marginBottom: "8px",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "12px 44px 12px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
  },
  togglePassword: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },

  formOptions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
  },

  forgotLink: {
    color: "#c00",
    textDecoration: "none",
  },

  loginButton: {
    width: "100%",
    padding: "14px",
    background: "#c00",
    color: "white",
    borderRadius: "8px",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  },

  signupLink: {
    textAlign: "center",
    fontSize: "14px",
  },
  signupLinkA: {
    color: "#c00",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
