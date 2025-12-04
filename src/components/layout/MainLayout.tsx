import { Outlet, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomepage = location.pathname === '/' || location.pathname === '/home';
  
  return (
    <div className="app-container">
      <Header />
      <main className="main-content" style={{ paddingTop: isHomepage ? '0' : '100px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;