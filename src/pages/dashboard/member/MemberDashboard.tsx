import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth";

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 dark:border-gray-700">
            <p className="text-center mt-8 text-gray-500 dark:text-gray-400">
              Welcome to your member dashboard
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
