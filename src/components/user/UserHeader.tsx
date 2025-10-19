import React from 'react';
import { Link } from 'react-router-dom';
import styles from './UserHeader.module.css';

const UserHeader: React.FC = () => {
    return (
        <header className={styles.userHeader}>
            <div className={styles.headerContainer}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumbSection}>
                    <Link to="/" className={styles.breadcrumbLink}>
                        <span className="home-icon">🏠</span>
                        <span>Trang chủ</span>
                    </Link>
                    <span className={styles.breadcrumbSeparator}>&gt;</span>
                    <span className={styles.breadcrumbCurrent}>Hồ sơ cá nhân</span>
                </div>

                {/* Status Badges */}
                <div className={styles.statusSection}>
                    <div className={`${styles.statusBadge} ${styles.statusBadgeVerified}`}>
                        <span className={styles.statusDot}></span>
                        <span>Đã xác thực</span>
                    </div>
                    <div className={`${styles.statusBadge} ${styles.statusBadgeActive}`}>
                        <span>Đang hoạt động</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
