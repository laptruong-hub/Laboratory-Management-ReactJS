import React from "react";
import { Outlet } from "react-router-dom";
import WorkingSidebar from "../working/WorkingSidebar";
import WorkingNavbar from "../working/WorkingNavbar";

const WorkingLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden bg-gray-50 box-border">
      {/* Left Sidebar */}
      <aside className="w-[280px] flex flex-col bg-white border-r border-gray-200 hidden md:flex">
        <WorkingSidebar />
      </aside>

      {/* Right Panel with Navbar and Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top Navbar */}
        <WorkingNavbar />

        {/* Content Area */}
        <main className="flex-1 overflow-auto flex flex-col min-h-0 p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkingLayout;
