import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";

const UserLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/user/profile";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
      }}
    >
      {/* Hide Header when on profile page */}
      {!isProfilePage && <Header />}
      
      <main
        style={{
          flex: 1,
          padding: isProfilePage ? "0" : "32px",
          backgroundColor: "#FAFAFA",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
