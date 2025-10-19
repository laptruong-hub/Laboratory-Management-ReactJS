import React, { useState } from 'react';
import styles from './UserSidebar.module.css';

const UserSidebar: React.FC = () => {
    const [settings, setSettings] = useState({
        smsNotifications: true,
        showStatus: true,
        autoUpdate: false,
        logoutOtherDevices: false
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleLogout = () => {
        console.log('Logout clicked');
    };

    return (
        <aside className={styles.userSidebar}>
            {/* User Info Section */}
            <div className={styles.userInfoSection}>
                <div className="user-avatar">
                    <div className={styles.avatarCircle}>
                        <span className={styles.avatarText}>LV</span>
                    </div>
                </div>
                <div className="user-details">
                    <h2 className={styles.userName}>Lê Việt</h2>
                    <div className={styles.userRoleBadge}>
                        <span>Lab User</span>
                    </div>
                </div>
                <div className={styles.userContactInfo}>
                    <div className={styles.contactItem}>
                        <span className={styles.contactIcon}>📧</span>
                        <span className={styles.contactText}>teststaff@gmail.com</span>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.contactIcon}>📞</span>
                        <span className={styles.contactText}>0912345678</span>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.contactIcon}>🆔</span>
                        <span className={styles.contactText}>ID: 12345678</span>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.contactIcon}>📅</span>
                        <span className={styles.contactText}>Thành viên từ 04/03/2025</span>
                    </div>
                </div>
            </div>

            {/* Quick Settings Section */}
            <div className={styles.quickSettingsSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>⚙️</span>
                    <h3>Cài đặt nhanh</h3>
                </div>

                <div className={styles.settingsList}>
                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingTitle}>Thông báo SMS</div>
                            <div className={styles.settingDesc}>Nhận SMS về kết quả</div>
                        </div>
                        <div className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={settings.smsNotifications}
                                onChange={() => toggleSetting('smsNotifications')}
                            />
                            <span className={styles.slider}></span>
                        </div>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingTitle}>Hiển thị trạng thái</div>
                            <div className={styles.settingDesc}>Trạng thái online</div>
                        </div>
                        <div className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={settings.showStatus}
                                onChange={() => toggleSetting('showStatus')}
                            />
                            <span className={styles.slider}></span>
                        </div>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingTitle}>Tự động cập nhật</div>
                            <div className={styles.settingDesc}>Cập nhật hệ thống</div>
                        </div>
                        <div className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={settings.autoUpdate}
                                onChange={() => toggleSetting('autoUpdate')}
                            />
                            <span className={styles.slider}></span>
                        </div>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingTitle}>Đăng xuất thiết bị khác</div>
                            <div className={styles.settingDesc}>Bảo mật tài khoản</div>
                        </div>
                        <div className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={settings.logoutOtherDevices}
                                onChange={() => toggleSetting('logoutOtherDevices')}
                            />
                            <span className={styles.slider}></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Actions Section */}
            <div className={styles.accountActionsSection}>
                <button className={styles.actionBtn}>
                    <span className={styles.btnIcon}>←</span>
                    Về trang nhân viên
                </button>
                <button className={styles.actionBtn}>
                    <span className={styles.btnIcon}>→</span>
                    Đăng xuất
                </button>
                <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={handleLogout}>
                    <span className={styles.btnIcon}>🗑️</span>
                    Xóa tài khoản
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;
