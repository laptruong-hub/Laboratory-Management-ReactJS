import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const UserSecurityTab = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSave = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    console.log('Changing password');
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '6px',
      border: '1px solid #E5E5E5',
      padding: '32px',
      maxWidth: '600px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FFF2F0',
            border: '1px solid #FFCCC7',
            borderRadius: '4px',
            color: '#FF4D4F',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#262626',
            marginBottom: '8px'
          }}>
            <Lock size={16} />
            Mật khẩu hiện tại
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 12px 8px 12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#262626',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1890FF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D9D9D9';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              style={{
                position: 'absolute',
                right: '12px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#8C8C8C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#262626',
            marginBottom: '8px'
          }}>
            <Lock size={16} />
            Mật khẩu mới
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#262626',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1890FF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D9D9D9';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              style={{
                position: 'absolute',
                right: '12px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#8C8C8C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#262626',
            marginBottom: '8px'
          }}>
            <Lock size={16} />
            Xác nhận mật khẩu mới
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#262626',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#de1919ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D9D9D9';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              style={{
                position: 'absolute',
                right: '12px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#8C8C8C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '12px'
        }}>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 24px',
              backgroundColor: '#de1919ff',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#de1919ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#de1919ff';
            }}
          >
            Cập nhật mật khẩu
          </button>
          <button
            style={{
              padding: '8px 24px',
              backgroundColor: '#FAFAFA',
              color: '#262626',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F0F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FAFAFA';
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSecurityTab;
//commit
