import { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';

const UserProfileTab = () => {
  const [formData, setFormData] = useState({
    fullName: 'Lê Việt',
    email: 'teststaff@gmail.com',
    phone: '0912345678'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
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
            <User size={16} />
            Họ và tên
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
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
            <Mail size={16} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
            <Phone size={16} />
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
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
              fontWeight: 500,
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
            Lưu thay đổi
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

export default UserProfileTab;
//commit