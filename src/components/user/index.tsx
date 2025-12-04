import { Link } from 'react-router-dom';

import UserSidebar from '../user/UserSidebar';


const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">Chào mừng đến với User Dashboard</h1>
        <p className="text-xl text-muted-foreground mb-8">Quản lý thông tin cá nhân và cài đặt bảo mật</p>
        <Link 
          to="/user/profile"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Truy cập hồ sơ
        </Link>
      </div>
    </div>
  );
};

export default Index;
