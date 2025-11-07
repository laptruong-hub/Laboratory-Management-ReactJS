import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import UserProfileTab from './UserProfileTab';
import UserSecurityTab from './UserSecurityTab';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#262626',
          margin: '0 0 8px 0'
        }}>
          Thông tin cá nhân
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#8C8C8C',
          margin: 0
        }}>
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid #E5E5E5',
        marginBottom: '32px'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            color: activeTab === 'profile' ? '#de1919ff' : '#8C8C8C',
            borderBottom: activeTab === 'profile' ? '2px solid #de1919ff' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginBottom: '-1px'
          }}
        >
          <User size={16} />
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 5,
            color: activeTab === 'security' ? '#de1919ff' : '#8C8C8C',
            borderBottom: activeTab === 'security' ? '2px solid #de1919ff' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginBottom: '-1px'
          }}
        >
          <Lock size={16} />
          Bảo mật
        </button>
      </div>

      <div>
        {activeTab === 'profile' && <UserProfileTab />}
        {activeTab === 'security' && <UserSecurityTab />}
      </div>
    </div>
  );
};

export default UserProfile;
//commit