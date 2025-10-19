import { Outlet } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import UserHeader from '../../components/user/UserHeader';
import styles from './UserLayout.module.css';

const UserLayout = () => {
    return (
        <div className={styles.userLayout}>
            <UserHeader />
            <div className={styles.userBody}>
                <UserSidebar />
                <main className={styles.userMainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
