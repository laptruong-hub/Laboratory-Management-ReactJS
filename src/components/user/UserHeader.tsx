import React from 'react';
import { Link } from 'react-router-dom';

const UserHeader: React.FC = () => {

    return (
        <header style={{
            backgroundColor: '#FFFFFF',
            padding: '16px 0',
            borderBottom: '1px solid #E6E6E6'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Breadcrumb */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#737373',
                        textDecoration: 'none',
                        fontSize: '12.8px'
                    }}>
                        <span className="home-icon">🏠</span>
                        <span>Trang chủ</span>
                    </Link>
                    <span style={{
                        color: '#737373',
                        fontSize: '12.8px'
                    }}>&gt;</span>
                    <span style={{
                        color: '#262626',
                        fontWeight: 600,
                        fontSize: '13.2px'
                    }}>Hồ sơ cá nhân</span>
                </div>

                {/* Status Badges */}
                <div style={{
                    display: 'flex',
                    gap: '8px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2.8px 10.8px',
                        borderRadius: '9999px',
                        fontSize: '11.1px',
                        fontWeight: 600,
                        backgroundColor: '#16A249',
                        color: '#FFFFFF'
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '50%'
                        }}></span>
                        <span>Đã xác thực</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2.8px 10.8px',
                        borderRadius: '9999px',
                        fontSize: '11.1px',
                        fontWeight: 600,
                        backgroundColor: '#F5F5F5',
                        color: '#333333'
                    }}>
                        <span>Đang hoạt động</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
