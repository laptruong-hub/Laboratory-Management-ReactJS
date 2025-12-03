import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaHistory, FaClipboardList, FaFlask, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import AccountEdit from "./AccountEdit";
import SettingsSidebar from "./SettingsSidebar";
import MedicalRecord from "./MedicalRecord";
import PatientTestResults from "../patient/PatientTestResults";
import PatientBooking from "./PatientBooking";

// Main UserProfile component
type ProfileTab = "account-edit" | "medical-record" | "booking" | "test-results";

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>("account-edit");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Read query param to set initial tab
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && availableTabs.includes(tabParam as ProfileTab)) {
      setActiveTab(tabParam as ProfileTab);
      // Remove query param after setting tab
      searchParams.delete("tab");
      setSearchParams(searchParams);
    }
  }, []);

  const tabIcons = {
    "account-edit": <FaUser className="mr-2" />,
    "medical-record": <FaClipboardList className="mr-2" />,
    "booking": <FaCalendarAlt className="mr-2" />,
    "test-results": <FaFlask className="mr-2" />,
  };

  const tabLabels: Record<ProfileTab, string> = {
    "account-edit": "Tài khoản",
    "medical-record": "Hồ sơ bệnh án",
    "booking": "Đặt lịch",
    "test-results": "Kết quả xét nghiệm",
  };

  const availableTabs: ProfileTab[] = ["account-edit", "medical-record", "booking", "test-results"];

  return (
    <div className="container mx-auto px-4 py-8">
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Hồ sơ cá nhân</h1>
          <div className="w-6"></div>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8 md:min-w-[1000px]">
        {/* Left Side - Settings Sidebar */}
        {!isMobile ? (
          <div className="w-full md:w-1/3 lg:w-1/4">
            <SettingsSidebar />
          </div>
        ) : (
          <AnimatePresence>
            {showMobileSidebar && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm"
              >
                <SettingsSidebar isMobile onClose={() => setShowMobileSidebar(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {/* Right Side - Content */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {/* Navigation Toggle - Responsive version */}
          <div className="flex justify-center mb-8">
            {isMobile ? (
              <div className="w-full bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
                <div className="flex">
                  {availableTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 flex items-center justify-center px-4 py-3 text-base font-medium transition-all duration-200 rounded-full relative cursor-pointer ${
                        activeTab === tab ? "text-[#C14B53] bg-[#F8F9FA] shadow-inner" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={{ minHeight: 44 }}
                    >
                      {tabIcons[tab]}
                      {tabLabels[tab]}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="mobileTabIndicator"
                          className="absolute bottom-0 left-3 right-3 h-1 rounded-full bg-[#C14B53]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                className="flex bg-white rounded-full shadow-md border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {availableTabs.map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex items-center justify-center px-6 py-4 text-base font-medium cursor-pointer transition-all duration-200 rounded-full relative ${
                      activeTab === tab ? "text-white" : "text-gray-700 hover:bg-gray-50"
                    }`}
                    style={{ minHeight: 48 }}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center whitespace-nowrap">
                      {tabIcons[tab]}
                      {tabLabels[tab]}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
          {/* Conditional Rendering with swipe support */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ x: isMobile ? (activeTab === "account-edit" ? 50 : -50) : 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isMobile ? (activeTab === "account-edit" ? -50 : 50) : 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {activeTab === "account-edit" ? (
                  <AccountEdit />
                ) : activeTab === "medical-record" ? (
                  <MedicalRecord />
                ) : activeTab === "booking" ? (
                  <PatientBooking />
                ) : (
                  <PatientTestResults />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
