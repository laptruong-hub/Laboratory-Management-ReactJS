import React from 'react';

const ForgotPassword: React.FC = () => {
  return (
    <div style={styles.forgotPassword}>
      <div style={styles.forgotPasswordCard}>
        <div style={styles.forgotPasswordIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={styles.iconSvg}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h1 style={styles.h1}>Hệ Thống Quản Lý Phòng Xét Nghiệm</h1>
        <p style={styles.forgotPasswordSubtitle}>Xác thực bằng mã OTP</p>

        <h2 style={styles.forgotPasswordSectionTitle}>Quên Mật Khẩu</h2>

        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Email <span style={styles.required}>*</span>
            </label>
            <input type="email" placeholder="email@example.com" style={styles.input} />
          </div>
          <button type="submit" style={styles.submitButton}>Gửi</button>
        </form>

        <div style={styles.forgotPasswordLinks}>
          <p style={styles.linkParagraph}>
            Đã có tài khoản? <a href="/auth/login" style={styles.link}>Đăng nhập</a>
          </p>
          <p style={styles.linkParagraph}>
            Cần trợ giúp? <a href="/support" style={styles.link}>Liên hệ hỗ trợ</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  forgotPassword: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #fce4e4 0%, #f8d7da 50%, #fadbd8 100%)',
  },
  forgotPasswordCard: {
    height: '400px',
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center' as const,
  },
  forgotPasswordIcon: {
    width: '35px',
    height: '35px',
    backgroundColor: '#fee2e2',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  iconSvg: {
    width: '20px',
    height: '20px',
    color: '#ff0000',
  },
  h1: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: '1.4',
    margin: '0',
  },
  forgotPasswordSubtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.5rem 0',
  },
  forgotPasswordSectionTitle: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'left' as const,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    textAlign: 'left' as const,
  },
  label: {
    fontWeight: '500',
    fontSize: '0.875rem',
    color: '#374151',
  },
  required: {
    color: '#ff0000',
    marginLeft: '2px',
  },
  input: {
    padding: '0.875rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    background: '#f9fafb',
    color: '#1f2937',
    fontSize: '0.9375rem',
    transition: 'all 0.2s',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  submitButton: {
    padding: '0.5rem',
    background: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  forgotPasswordLinks: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '1.5rem',
    marginTop: '0.5rem',
  },
  linkParagraph: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0',
  },
  link: {
    color: '#ff0000',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
};

export default ForgotPassword;
