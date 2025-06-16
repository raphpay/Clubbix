import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardNavbar from "./DashboardNavBar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar onMenuClick={toggleSidebar} />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} />
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
