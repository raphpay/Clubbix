import { Calendar, Dumbbell, Globe, User, Users, Wallet } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { t } = useTranslation("sidebar");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const adminNavItems = [
    { path: "/admin/dashboard/members", icon: Users, label: t("members") },
    { path: "/admin/dashboard/treasury", icon: Wallet, label: t("treasury") },
    { path: "/admin/dashboard/website", icon: Globe, label: t("website") },
    { path: "/admin/dashboard/events", icon: Calendar, label: t("events") },
    { path: "/admin/dashboard/profile", icon: User, label: t("profile") },
  ];

  const memberNavItems = [
    {
      path: "/member/dashboard/trainings",
      icon: Dumbbell,
      label: t("trainings"),
    },
    { path: "/member/dashboard/events", icon: Calendar, label: t("events") },
    { path: "/member/dashboard/profile", icon: User, label: t("profile") },
  ];

  const navItems = isAdmin ? adminNavItems : memberNavItems;

  return (
    <aside
      className={`fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                    isActive ? "bg-gray-100" : ""
                  }`
                }
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
