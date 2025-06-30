import { Menu } from "lucide-react";
import React from "react";
import { useClub } from "../../hooks/useClub";
import { ProfileButton } from "../common/ProfileButton";
import { ThemeToggle } from "../common/ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";
import { Logo } from "../ui/Logo";

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ onMenuClick }) => {
  const { club } = useClub();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 mr-2 text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <div className="pr-4">
                <Logo />
              </div>
              {club && (
                <span className="text-lg font-semibold text-gray-800">
                  {club.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <ProfileButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
