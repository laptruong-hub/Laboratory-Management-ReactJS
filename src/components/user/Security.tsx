import React, { useState } from 'react';

const Security: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications' | 'sessions'>('security');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const tabs = [
        { id: 'personal', label: 'Thông tin cá nhân', icon: '👤' },
        { id: 'security', label: 'Bảo mật', icon: '🛡️' },
        { id: 'notifications', label: 'Thông báo', icon: '🔔' },
        { id: 'sessions', label: 'Phiên làm việc', icon: '🖥️' }
    ];

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Changing password...');
    };

    const handleTwoFactorToggle = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        console.log('Two-factor authentication:', !twoFactorEnabled);
    };

    return (
        <div style={{
            maxWidth: '896px',
            margin: '0 auto'
        }}>
            {/* Page Header */}
            <div style={{
                marginBottom: '24px'
            }}>
                <h1 style={{
                    fontSize: '29.6px',
                    fontWeight: 700,
                    lineHeight: '36px',
                    color: '#262626',
                    margin: '0 0 8px 0'
                }}>Hồ sơ người dùng</h1>
                <p style={{
                    fontSize: '15px',
                    lineHeight: '24px',
                    color: '#737373',
                    margin: 0
                }}>Quản lý thông tin cá nhân và cài đặt bảo mật của bạn</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: 0,
                marginBottom: '24px',
                borderBottom: '1px solid #E5E5E5'
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'personal' | 'security' | 'notifications' | 'sessions')}
                        style={{
                            padding: '12px 16px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: activeTab === tab.id ? '#de1919' : '#8C8C8C',
                            borderBottom: activeTab === tab.id ? '2px solid #de1919' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            marginBottom: '-1px'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
            }}>
                {activeTab === 'security' && (
                    <>
                        {/* Change Password Section */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            padding: '24px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px'
                            }}>
                                <span className="section-icon">🔒</span>
                                <h2 style={{
                                    fontSize: '17.4px',
                                    fontWeight: 600,
                                    lineHeight: '28px',
                                    color: '#262626',
                                    margin: 0
                                }}>Đổi mật khẩu</h2>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px',
                                background: 'rgba(255, 235, 239, 0.5)',
                                border: '1px solid rgba(255, 0, 51, 0.2)',
                                borderRadius: '8px',
                                marginBottom: '16px'
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                <span style={{
                                    fontSize: '13.2px',
                                    lineHeight: '20px',
                                    color: '#FF0033'
                                }}>Mật khẩu phải có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường và số</span>
                            </div>

                            <form onSubmit={handlePasswordChange} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    <label style={{
                                        fontSize: '13.3px',
                                        fontWeight: 600,
                                        color: '#262626'
                                    }}>Mật khẩu hiện tại *</label>
                                    <div style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: '12px',
                                            fontSize: '16px',
                                            color: '#737373',
                                            zIndex: 1
                                        }}>🔒</span>
                                        <input
                                            type="password"
                                            placeholder="Nhập mật khẩu hiện tại"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                padding: '10px 40px',
                                                border: '1px solid #E6E6E6',
                                                borderRadius: '6px',
                                                backgroundColor: '#FAFAFA',
                                                fontSize: '13.3px',
                                                boxSizing: 'border-box',
                                                color: '#262626'
                                            }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            right: '12px',
                                            fontSize: '16px',
                                            color: '#737373',
                                            cursor: 'pointer',
                                            zIndex: 1
                                        }}>👁️</span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    <label style={{
                                        fontSize: '13.3px',
                                        fontWeight: 600,
                                        color: '#262626'
                                    }}>Mật khẩu mới *</label>
                                    <div style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: '12px',
                                            fontSize: '16px',
                                            color: '#737373',
                                            zIndex: 1
                                        }}>🔒</span>
                                        <input
                                            type="password"
                                            placeholder="Nhập mật khẩu mới"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                padding: '10px 40px',
                                                border: '1px solid #E6E6E6',
                                                borderRadius: '6px',
                                                backgroundColor: '#FAFAFA',
                                                fontSize: '13.3px',
                                                boxSizing: 'border-box',
                                                color: '#262626'
                                            }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            right: '12px',
                                            fontSize: '16px',
                                            color: '#737373',
                                            cursor: 'pointer',
                                            zIndex: 1
                                        }}>👁️</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    }}>
                                        <div style={{
                                            height: '4px',
                                            backgroundColor: '#F5F5F5',
                                            borderRadius: '9999px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                borderRadius: '9999px',
                                                transition: 'width 0.3s',
                                                width: '33%',
                                                backgroundColor: '#EF4343'
                                            }}></div>
                                        </div>
                                        <span style={{
                                            fontSize: '11.3px',
                                            lineHeight: '16px',
                                            color: '#737373'
                                        }}>Mật khẩu yếu</span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    <label style={{
                                        fontSize: '13.3px',
                                        fontWeight: 600,
                                        color: '#262626'
                                    }}>Xác nhận mật khẩu mới *</label>
                                    <div style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: '12px',
                                            fontSize: '16px',
                                            color: '#737373',
                                            zIndex: 1
                                        }}>🔒</span>
                                        <input
                                            type="password"
                                            placeholder="Nhập lại mật khẩu mới"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                padding: '10px 40px',
                                                border: '1px solid #E6E6E6',
                                                borderRadius: '6px',
                                                backgroundColor: '#FAFAFA',
                                                fontSize: '13.3px',
                                                boxSizing: 'border-box',
                                                color: '#262626'
                                            }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            right: '12px',
                                            fontSize: '16px',
                                            color: '#737373',
                                            cursor: 'pointer',
                                            zIndex: 1
                                        }}>👁️</span>
                                    </div>
                                </div>

                                <button type="submit" style={{
                                    backgroundColor: '#de1919',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontSize: '13.5px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    Đổi mật khẩu
                                </button>
                            </form>
                        </div>

                        {/* Two-Factor Authentication Section */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            padding: '24px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px'
                            }}>
                                <span className="section-icon">🛡️</span>
                                <h2 style={{
                                    fontSize: '17.4px',
                                    fontWeight: 600,
                                    lineHeight: '28px',
                                    color: '#262626',
                                    margin: 0
                                }}>Xác thực hai yếu tố (2FA)</h2>
                            </div>

                            <div style={{
                                marginBottom: '16px'
                            }}>
                                <div style={{
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '9999px',
                                    padding: '2.8px 10.8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <span style={{
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: '#333333',
                                        borderRadius: '50%'
                                    }}></span>
                                    <span style={{
                                        fontSize: '11.1px',
                                        fontWeight: 600,
                                        color: '#333333'
                                    }}>Chưa kích hoạt</span>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '13.1px',
                                lineHeight: '20px',
                                color: '#737373',
                                margin: '0 0 16px 0'
                            }}>
                                Tăng cường bảo mật tài khoản bằng xác thực hai yếu tố
                            </p>

                            <button style={{
                                backgroundColor: '#de1919',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '13.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} onClick={handleTwoFactorToggle}>
                                Kích hoạt 2FA
                            </button>
                        </div>

                        {/* Linked Accounts Section */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            padding: '24px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px'
                            }}>
                                <span className="section-icon">🔗</span>
                                <h2 style={{
                                    fontSize: '17.4px',
                                    fontWeight: 600,
                                    lineHeight: '28px',
                                    color: '#262626',
                                    margin: 0
                                }}>Tài khoản liên kết</h2>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    border: '1px solid #E6E6E6',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            color: 'white',
                                            background: 'linear-gradient(45deg, #EA4335, #FBBC05, #34A853, #4285F4)'
                                        }}>
                                            <span>G</span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{
                                                fontSize: '15.3px',
                                                fontWeight: 600,
                                                lineHeight: '24px',
                                                color: '#262626'
                                            }}>Google</div>
                                            <div style={{
                                                fontSize: '13px',
                                                lineHeight: '20px',
                                                color: '#737373'
                                            }}>teststaff@gmail.com</div>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span style={{
                                            backgroundColor: '#16A249',
                                            color: 'white',
                                            padding: '2.8px 10.8px',
                                            borderRadius: '9999px',
                                            fontSize: '11.4px',
                                            fontWeight: 600
                                        }}>Đã liên kết</span>
                                        <button style={{
                                            backgroundColor: '#FAFAFA',
                                            color: '#262626',
                                            border: '1px solid #E6E6E6',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            fontSize: '13.6px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s'
                                        }}>
                                            Ngắt kết nối
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    border: '1px solid #E6E6E6',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            color: 'white',
                                            backgroundColor: '#00A4EF'
                                        }}>
                                            <span>M</span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{
                                                fontSize: '15.3px',
                                                fontWeight: 600,
                                                lineHeight: '24px',
                                                color: '#262626'
                                            }}>Microsoft</div>
                                            <div style={{
                                                fontSize: '13px',
                                                lineHeight: '20px',
                                                color: '#737373'
                                            }}>Chưa liên kết</div>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <button style={{
                                            backgroundColor: '#FAFAFA',
                                            color: '#262626',
                                            border: '1px solid #E6E6E6',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            fontSize: '13.6px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s'
                                        }}>
                                            Liên kết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Log Section */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            padding: '24px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px'
                            }}>
                                <span className="section-icon">📋</span>
                                <h2 style={{
                                    fontSize: '17.4px',
                                    fontWeight: 600,
                                    lineHeight: '28px',
                                    color: '#262626',
                                    margin: 0
                                }}>Nhật ký bảo mật</h2>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                marginBottom: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        backgroundColor: '#F5F5F5',
                                        color: '#16A249'
                                    }}>✓</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '13.3px',
                                            fontWeight: 600,
                                            lineHeight: '20px',
                                            color: '#262626',
                                            marginBottom: '4px'
                                        }}>Đổi mật khẩu thành công</div>
                                        <div style={{
                                            fontSize: '11.1px',
                                            lineHeight: '16px',
                                            color: '#737373'
                                        }}>2 giờ trước • 15/10/2025 10:30</div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        backgroundColor: '#F5F5F5',
                                        color: '#F59F0A'
                                    }}>⚠️</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '13.3px',
                                            fontWeight: 600,
                                            lineHeight: '20px',
                                            color: '#262626',
                                            marginBottom: '4px'
                                        }}>Đăng nhập thất bại (3 lần)</div>
                                        <div style={{
                                            fontSize: '11.1px',
                                            lineHeight: '16px',
                                            color: '#737373'
                                        }}>1 ngày trước • 14/10/2025 08:15</div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        backgroundColor: '#F5F5F5',
                                        color: '#FF0033'
                                    }}>i</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '13.3px',
                                            fontWeight: 600,
                                            lineHeight: '20px',
                                            color: '#262626',
                                            marginBottom: '4px'
                                        }}>Cập nhật thông tin cá nhân</div>
                                        <div style={{
                                            fontSize: '11.1px',
                                            lineHeight: '16px',
                                            color: '#737373'
                                        }}>3 ngày trước • 12/10/2025 14:20</div>
                                    </div>
                                </div>
                            </div>

                            <button style={{
                                backgroundColor: '#FAFAFA',
                                color: '#262626',
                                border: '1px solid #E6E6E6',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '13.6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                width: '100%'
                            }}>
                                Xem tất cả nhật ký
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Security;