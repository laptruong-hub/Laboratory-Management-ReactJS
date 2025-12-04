import React, { useState, useEffect } from "react";
// import loginImg from "../../assets/img/login.jpg"; // Image file not found - using placeholder
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiPublic } from "../../api/apiClient.ts";
import { setToken, setRememberMe, setRememberedEmail, getRememberedEmail, getRememberMe } from "../../utils/storage";

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
    } catch (err: unknown) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT SIDE - Info Panel */}
        <div className="lg:w-80 bg-gradient-to-br from-red-50 to-red-100 p-8 lg:p-12 flex flex-col justify-between">
          {/* Logo/Brand Section */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-white font-bold text-xl">LM</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Phòng Lab Xét Nghiệm Máu
            </h2>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Nơi cung cấp kết quả chính xác và nhanh chóng giúp bạn theo dõi sức khỏe hiệu quả.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-gray-700">
              <FaMapMarkerAlt className="text-red-600 w-5 h-5 flex-shrink-0" />
              <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FaPhoneAlt className="text-red-600 w-5 h-5 flex-shrink-0" />
              <span className="text-sm">1900 xxxx</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FaEnvelope className="text-red-600 w-5 h-5 flex-shrink-0" />
              <span className="text-sm">info@labxetnghiem.vn</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Hệ Thống Quản Lý
                <br />
                <span className="text-red-600">Phòng Xét Nghiệm</span>
              </h1>
              <p className="text-lg text-gray-600 font-medium">Chào mừng trở lại</p>
              <p className="text-sm text-gray-500 mt-1">Đăng nhập để tiếp tục</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="email@benhvien.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Form Options */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMeState(e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng Nhập"
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <a
                    href="/auth/signup"
                    className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
                  >
                    Đăng ký ngay
                  </a>
                </p>
              </div>
            </form>
          </div>
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
