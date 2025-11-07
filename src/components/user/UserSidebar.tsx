import { User, Mail, Phone, CreditCard, Zap, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#FAFAFA';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <LogOut size={16} />
        Đăng xuất
      </button>
    </aside>
  );
};

export default UserSidebar;
//commit