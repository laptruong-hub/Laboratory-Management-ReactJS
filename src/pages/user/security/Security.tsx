import React, { useState } from 'react';
import styles from './Security.module.css';

const Security: React.FC = () => {
    const [activeTab, setActiveTab] = useState('security');
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
        <div className={styles.securityPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1>Hồ sơ người dùng</h1>
                <p>Quản lý thông tin cá nhân và cài đặt bảo mật của bạn</p>
            </div>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className={styles.tabIcon}>{tab.icon}</span>
                            <span className={styles.tabLabel}>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === 'security' && (
                    <>
                        {/* Change Password Section */}
                        <div className={styles.securitySection}>
                            <div className={styles.sectionHeader}>
                                <span className="section-icon">🔒</span>
                                <h2>Đổi mật khẩu</h2>
                            </div>

                            <div className={styles.passwordWarning}>
                                <span className={styles.warningIcon}>⚠️</span>
                                <span>Mật khẩu phải có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường và số</span>
                            </div>

                            <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
                                <div className={styles.formGroup}>
                                    <label>Mật khẩu hiện tại *</label>
                                    <div className={styles.inputContainer}>
                                        <span className={styles.inputIcon}>🔒</span>
                                        <input
                                            type="password"
                                            placeholder="Nhập mật khẩu hiện tại"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                        <span className={styles.inputToggle}>👁️</span>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Mật khẩu mới *</label>
                                    <div className={styles.inputContainer}>
                                        <span className={styles.inputIcon}>🔒</span>
                                        <input
                                            type="password"
                                            placeholder="Nhập mật khẩu mới"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <span className={styles.inputToggle}>👁️</span>
                                    </div>
                                    <div className={styles.passwordStrength}>
                                        <div className={styles.strengthBar}>
                                            <div className={`${styles.strengthFill} ${styles.strengthFillWeak}`}></div>
                                        </div>
                                        <span className={styles.strengthText}>Mật khẩu yếu</span>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Xác nhận mật khẩu mới *</label>
                                    <div className={styles.inputContainer}>
                                        <span className={styles.inputIcon}>🔒</span>
                                        <input
                                            type="password"
                                            placeholder="Nhập lại mật khẩu mới"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <span className={styles.inputToggle}>👁️</span>
                                    </div>
                                </div>

                                <button type="submit" className={styles.btnPrimary}>
                                    Đổi mật khẩu
                                </button>
                            </form>
                        </div>

                        {/* Two-Factor Authentication Section */}
                        <div className={styles.securitySection}>
                            <div className={styles.sectionHeader}>
                                <span className="section-icon">🛡️</span>
                                <h2>Xác thực hai yếu tố (2FA)</h2>
                            </div>

                            <div className={styles.twoFactorStatus}>
                                <div className={styles.statusBadgeInactive}>
                                    <span className={styles.statusIcon}></span>
                                    <span>Chưa kích hoạt</span>
                                </div>
                            </div>

                            <p className={styles.twoFactorDesc}>
                                Tăng cường bảo mật tài khoản bằng xác thực hai yếu tố
                            </p>

                            <button className={styles.btnPrimary} onClick={handleTwoFactorToggle}>
                                Kích hoạt 2FA
                            </button>
                        </div>

                        {/* Linked Accounts Section */}
                        <div className={styles.securitySection}>
                            <div className={styles.sectionHeader}>
                                <span className="section-icon">🔗</span>
                                <h2>Tài khoản liên kết</h2>
                            </div>

                            <div className={styles.linkedAccounts}>
                                <div className={styles.accountItem}>
                                    <div className={styles.accountInfo}>
                                        <div className={`${styles.accountAvatar} ${styles.accountAvatarGoogle}`}>
                                            <span>G</span>
                                        </div>
                                        <div className={styles.accountDetails}>
                                            <div className={styles.accountName}>Google</div>
                                            <div className={styles.accountEmail}>teststaff@gmail.com</div>
                                        </div>
                                    </div>
                                    <div className={styles.accountActions}>
                                        <span className={styles.statusBadgeConnected}>Đã liên kết</span>
                                        <button className={styles.btnSecondary}>Ngắt kết nối</button>
                                    </div>
                                </div>

                                <div className={styles.accountItem}>
                                    <div className={styles.accountInfo}>
                                        <div className={`${styles.accountAvatar} ${styles.accountAvatarMicrosoft}`}>
                                            <span>M</span>
                                        </div>
                                        <div className={styles.accountDetails}>
                                            <div className={styles.accountName}>Microsoft</div>
                                            <div className={styles.accountEmail}>Chưa liên kết</div>
                                        </div>
                                    </div>
                                    <div className={styles.accountActions}>
                                        <button className={styles.btnSecondary}>Liên kết</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Log Section */}
                        <div className={styles.securitySection}>
                            <div className={styles.sectionHeader}>
                                <span className="section-icon">📋</span>
                                <h2>Nhật ký bảo mật</h2>
                            </div>

                            <div className={styles.securityLog}>
                                <div className={styles.logItem}>
                                    <div className={`${styles.logIcon} ${styles.logIconSuccess}`}>✓</div>
                                    <div className={styles.logContent}>
                                        <div className={styles.logTitle}>Đổi mật khẩu thành công</div>
                                        <div className={styles.logTime}>2 giờ trước • 15/10/2025 10:30</div>
                                    </div>
                                </div>

                                <div className={styles.logItem}>
                                    <div className={`${styles.logIcon} ${styles.logIconWarning}`}>⚠️</div>
                                    <div className={styles.logContent}>
                                        <div className={styles.logTitle}>Đăng nhập thất bại (3 lần)</div>
                                        <div className={styles.logTime}>1 ngày trước • 14/10/2025 08:15</div>
                                    </div>
                                </div>

                                <div className={styles.logItem}>
                                    <div className={`${styles.logIcon} ${styles.logIconInfo}`}>i</div>
                                    <div className={styles.logContent}>
                                        <div className={styles.logTitle}>Cập nhật thông tin cá nhân</div>
                                        <div className={styles.logTime}>3 ngày trước • 12/10/2025 14:20</div>
                                    </div>
                                </div>
                            </div>

                            <button className={`${styles.btnSecondary} ${styles.btnSecondaryFullWidth}`}>
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