import { Outlet } from 'react-router-dom';
import UserSidebar from '../user/UserSidebar';
import UserHeader from '../user/UserHeader';

const UserLayout = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#FAFAFA'
        }}>
            <UserHeader />
            <div style={{
                display: 'flex',
                flex: 1,
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                <UserSidebar />
                <main style={{
                    flex: 1,
                    padding: '32px',
                    backgroundColor: '#FAFAFA'
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
