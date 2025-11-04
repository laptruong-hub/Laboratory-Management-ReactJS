
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, FileText } from 'lucide-react';

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <FileText size={32} color="#ff0000" />
        </div>

        <h1 style={styles.title}>Hệ Thống Quản Lý Phòng Xét Nghiệm</h1>
        <p style={styles.subtitle}>Tạo tài khoản để truy cập hệ thống quản lý xét nghiệm</p>

        <h2 style={styles.sectionTitle}>Đăng Ký Tài Khoản</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <User size={14} style={styles.labelIcon} />
              Họ và tên <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên đầy đủ"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Mail size={14} style={styles.labelIcon} />
              Email <span style={styles.required}>*</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Phone size={14} style={styles.labelIcon} />
              Số điện thoại <span style={styles.required}>*</span>
            </label>
            <input
              type="tel"
              placeholder="0912 345 678"
              style={styles.input}
              required
            />
            <p style={styles.hint}>VD: 0912 345 678 hoặc +84 912 345 678</p>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Giới tính</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    style={styles.radio}
                  />
                  Nam
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    style={styles.radio}
                  />
                  Nữ
                </label>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Ngày sinh</label>
              <input
                type="date"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Lock size={14} style={styles.labelIcon} />
              Mật khẩu <span style={styles.required}>*</span>
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Tạo mật khẩu mạnh"
                style={styles.passwordInput}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Xác nhận mật khẩu</label>
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                style={styles.passwordInput}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Vai trò (Tùy chọn)</label>
            <select style={styles.select}>
              <option value="">Chọn vai trò của bạn</option>
              <option value="doctor">Bác sĩ</option>
              <option value="technician">Kỹ thuật viên</option>
              <option value="admin">Quản trị viên</option>
              <option value="staff">Nhân viên</option>
            </select>
            <p style={styles.hint}>Vai trò của bạn sẽ được xác nhận bởi admin sau khi tạo tài khoản.</p>
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={styles.checkbox}
                required
              />
              <span style={styles.checkboxText}>
                Tôi đồng ý với{' '}
                <a href="/terms" style={styles.link}>
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="/privacy" style={styles.link}>
                  Chính sách bảo mật
                </a>
              </span>
            </label>
          </div>

          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              Dữ liệu của bạn được xử lý theo tiêu chuẩn bảo mật HIPAA, GDPR và BPI
            </p>
          </div>

          <button type="submit" style={styles.submitButton}>
            <FileText size={18} style={{ marginRight: '8px' }} />
            Đăng ký
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Đã có tài khoản?{' '}
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
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #fce4e4 0%, #f8d7da 50%, #fadbd8 100%)',
    padding: '2rem 1rem',
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
    textAlign: 'center' as const,
  },
  iconContainer: {
    width: '50px',
    height: '50px',
    backgroundColor: '#fee2e2',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#1f2937',
    lineHeight: '1.4',
  },
  subtitle: {
    fontSize: '0.813rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.25rem',
    textAlign: 'left' as const,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  labelIcon: {
    marginRight: '0.25rem',
  },
  required: {
    color: '#ff0000',
    marginLeft: '2px',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    background: '#fef2f2',
    color: '#1f2937',
    fontSize: '0.9375rem',
    transition: 'all 0.2s',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  hint: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: '0',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  radioGroup: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
  },
  radio: {
    accentColor: '#ff0000',
    cursor: 'pointer',
  },
  passwordContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    padding: '0.75rem 3rem 0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    background: '#fef2f2',
    color: '#1f2937',
    fontSize: '0.9375rem',
    transition: 'all 0.2s',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  select: {
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    background: '#fef2f2',
    color: '#1f2937',
    fontSize: '0.9375rem',
    transition: 'all 0.2s',
    width: '100%',
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
  },
  checkboxGroup: {
    marginTop: '0.5rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  checkbox: {
    marginTop: '0.125rem',
    accentColor: '#ff0000',
    cursor: 'pointer',
    minWidth: '16px',
  },
  checkboxText: {
    lineHeight: '1.5',
  },
  infoBox: {
    background: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    marginTop: '0.5rem',
  },
  infoText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0',
    textAlign: 'left' as const,
    lineHeight: '1.5',
  },
  submitButton: {
    padding: '0.875rem 2rem',
    background: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    borderTop: '1px solid #f3f4f6',
    paddingTop: '1.25rem',
    marginTop: '1.5rem',
  },
  footerText: {
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

export default SignUp;

// noop change