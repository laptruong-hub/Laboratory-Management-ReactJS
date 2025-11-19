import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../user/UserSidebar";
import UserHeader from "../user/UserHeader";
import { Menu, X } from "lucide-react";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
      }}
    >
      <UserHeader />
      <div
        style={{
          display: "flex",
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: "none",
            position: "fixed",
            top: "80px",
            left: "16px",
            zIndex: 1001,
            padding: "8px",
            backgroundColor: "#ffffff",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          className="mobile-menu-button"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar with mobile support */}
        <div
          style={{
            position: "relative",
            zIndex: 1000,
          }}
          className="user-sidebar-wrapper"
        >
          <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              display: "none",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            className="sidebar-overlay"
          />
        )}

        <main
          style={{
            flex: 1,
            padding: "32px",
            backgroundColor: "#FAFAFA",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>

      <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-button {
                        display: block !important;
                    }
                    .user-sidebar-wrapper {
                        position: fixed;
                        left: ${sidebarOpen ? "0" : "-100%"};
                        top: 0;
                        height: 100vh;
                        transition: left 0.3s ease-in-out;
                        z-index: 1000;
                    }
                    .sidebar-overlay {
                        display: block !important;
                    }
                    main {
                        padding: 16px !important;
                    }
                }
            `}</style>
    </div>
  );
};

export default UserLayout;
