import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import React from "react";

const MainLayout: React.FC = () => {
  return (
    // 🧩 Bao ngoài toàn bộ app để đảm bảo chiếm 100% màn hình và zoom co đúng
    <div
      style={{
        width: "100vw",
        minHeight: "100vh", 
        display: "flex",
        flexDirection: "column", 
        overflow: "hidden",
      }}
    >
      <Header />

      {/* 🧩 Vùng nội dung chính, co giãn theo viewport */}
      <main
        style={{
          flex: 1, 
          display: "flex",
          justifyContent: "center",
          width: "100%", 
          boxSizing: "border-box",
          overflow: "hidden",
        }}
        className="main-content"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;