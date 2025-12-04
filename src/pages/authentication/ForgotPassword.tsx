import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { apiPublic } from "../../api/apiClient.ts";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  const navigate = useNavigate();

  // Show success notification when arriving at verify step
  useEffect(() => {
    if (step === "verify" && emailSentMessage) {
      const timer = setTimeout(() => {
        toast.success(emailSentMessage);
        setEmailSentMessage("");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step, emailSentMessage]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiPublic.post("/api/auth/forgot-password", {
        email: email,
      });

      if (response.data && response.data.success) {
        const successMessage = response.data.message || "Mã đặt lại mật khẩu đã được gửi đến email của bạn.";
        setEmailSentMessage(successMessage);
        setTimeout(() => {
          setStep("verify");
        }, 500);
      } else {
        toast.error("Có lỗi xảy ra khi gửi mã đặt lại mật khẩu.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message || "Email không tồn tại hoặc có lỗi xảy ra.");
      } else {
        toast.error("Không thể kết nối tới server. Vui lòng thử lại sau.");
      }
      console.error("Lỗi yêu cầu đặt lại mật khẩu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate code format
    if (!code || code.length !== 6) {
      toast.error("Mã xác nhận phải có 6 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiPublic.post("/api/auth/verify-reset-code", {
        code: code,
      });

      if (response.data && response.data.success && response.data.data?.valid) {
        // Code is valid, show success toast
        toast.success("Mã hợp lệ, đang chuyển hướng...");

        setCodeVerified(true);

        // Wait 2 seconds then proceed to reset step
        setTimeout(() => {
          setStep("reset");
          setCodeVerified(false);
          setIsLoading(false);
        }, 2000);
      } else {
        // Code is invalid or expired
        const errorMessage =
          response.data?.data?.message || response.data?.message || "Mã xác nhận không hợp lệ hoặc đã hết hạn.";
        toast.error(errorMessage);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        const errorMessage =
          errorData?.data?.message || errorData?.message || "Mã xác nhận không đúng hoặc đã hết hạn.";
        toast.error(errorMessage);
      } else {
        toast.error("Không thể kết nối tới server. Vui lòng thử lại sau.");
      }
      console.error("Lỗi xác minh mã:", err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiPublic.post("/api/auth/reset-password", {
        code: code,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || "Mật khẩu đã được đặt lại thành công.");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        toast.error("Có lỗi xảy ra khi đặt lại mật khẩu.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message || "Mã xác nhận không đúng hoặc đã hết hạn.");
      } else {
        toast.error("Không thể kết nối tới server. Vui lòng thử lại sau.");
      }
      console.error("Lỗi đặt lại mật khẩu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.forgotPassword}>
      <div style={styles.forgotPasswordCard}>
        <div style={styles.forgotPasswordIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={styles.iconSvg}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h1 style={styles.h1}>Hệ Thống Quản Lý Phòng Xét Nghiệm</h1>
        <p style={styles.forgotPasswordSubtitle}>Xác thực bằng mã OTP</p>

        <h2 style={styles.forgotPasswordSectionTitle}>
          {step === "email" ? "Quên Mật Khẩu" : step === "verify" ? "Xác Minh Mã" : "Đặt Lại Mật Khẩu"}
        </h2>

        {step === "email" ? (
          <form onSubmit={handleRequestReset} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi mã đặt lại"}
            </button>
          </form>
        ) : step === "verify" ? (
          <form onSubmit={handleVerifyCode} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Mã xác nhận <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={styles.input}
                required
                disabled={isLoading}
                maxLength={6}
              />
              <p style={styles.helpText}>Nhập mã xác nhận đã được gửi đến email của bạn</p>
            </div>
            <button type="submit" style={styles.submitButton} disabled={isLoading || codeVerified}>
              {isLoading ? "Đang xác minh..." : codeVerified ? "Đã xác minh" : "Xác minh mã"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              style={styles.backButton}
              disabled={isLoading || codeVerified}
            >
              Quay lại
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Mật khẩu mới <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  required
                  disabled={isLoading}
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

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Xác nhận mật khẩu <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  style={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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

            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>

            <button type="button" onClick={() => setStep("verify")} style={styles.backButton} disabled={isLoading}>
              Quay lại
            </button>
          </form>
        )}

        <div style={styles.forgotPasswordLinks}>
          <p style={styles.linkParagraph}>
            Đã có tài khoản?{" "}
            <a href="/auth/login" style={styles.link}>
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  forgotPassword: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fce4e4 0%, #f8d7da 50%, #fadbd8 100%)",
  },
  forgotPasswordCard: {
    minHeight: "400px",
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    textAlign: "center" as const,
    width: "100%",
    maxWidth: "450px",
  },
  forgotPasswordIcon: {
    width: "35px",
    height: "35px",
    backgroundColor: "#fee2e2",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  },
  iconSvg: {
    width: "20px",
    height: "20px",
    color: "#ff0000",
  },
  h1: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: "1.4",
    margin: "0",
  },
  forgotPasswordSubtitle: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: "0.5rem 0",
  },
  forgotPasswordSectionTitle: {
    margin: "0.5rem 0",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "left" as const,
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    textAlign: "left" as const,
    marginBottom: "1rem",
  },
  label: {
    fontWeight: "500",
    fontSize: "0.875rem",
    color: "#374151",
  },
  required: {
    color: "#ff0000",
    marginLeft: "2px",
  },
  input: {
    padding: "0.875rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    background: "#f9fafb",
    color: "#1f2937",
    fontSize: "0.9375rem",
    transition: "all 0.2s",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  inputWrapper: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
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
  submitButton: {
    padding: "0.75rem",
    background: "#ff0000",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    marginTop: "0.5rem",
  },
  backButton: {
    padding: "0.75rem",
    background: "transparent",
    color: "#ff0000",
    border: "1px solid #ff0000",
    borderRadius: "0.5rem",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    marginTop: "0.5rem",
  },
  forgotPasswordLinks: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
    borderTop: "1px solid #f3f4f6",
    paddingTop: "1.5rem",
    marginTop: "0.5rem",
  },
  linkParagraph: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: "0",
  },
  link: {
    color: "#ff0000",
    textDecoration: "none",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  helpText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    margin: "0.25rem 0 0 0",
  },
};

export default ForgotPassword;
