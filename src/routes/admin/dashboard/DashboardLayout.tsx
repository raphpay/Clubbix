import {
  Calendar,
  CreditCard,
  Dumbbell,
  Globe,
  House,
  Settings,
  Users,
} from "lucide-react";
import SidebarButton from "../../../components/SidebarButton";
import { useDashboardStore } from "../../../stores/useDashboardStore";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const setSection = useDashboardStore((state) => state.setSection);
  const section = useDashboardStore((state: any) => state.section);

  return (
    <section className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Clubbix</h2>
        <nav className="flex flex-col gap-3">
          <SidebarButton
            title="Dashboard"
            icon={<House />}
            isActive={section === "dashboard"}
            onClick={() => setSection("dashboard")}
          />
          <SidebarButton
            title="Membres"
            icon={<Users />}
            isActive={section === "members"}
            onClick={() => setSection("members")}
          />
          <SidebarButton
            title="Evènements"
            icon={<Calendar />}
            isActive={section === "events"}
            onClick={() => setSection("events")}
          />
          <SidebarButton
            title="Entrainements"
            icon={<Dumbbell />}
            isActive={section === "trainings"}
            onClick={() => setSection("trainings")}
          />
          <SidebarButton
            title="Trésorerie"
            icon={<CreditCard />}
            isActive={section === "finances"}
            onClick={() => setSection("finances")}
          />
          <SidebarButton
            title="Page du club"
            icon={<Globe />}
            isActive={section === "website"}
            onClick={() => setSection("website")}
          />
          <SidebarButton
            title="Paramètres"
            icon={<Settings />}
            isActive={section === "settings"}
            onClick={() => setSection("settings")}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {section === "dashboard" && (
          <header className="bg-white shadow px-6 py-4 sticky top-0 z-30">
            <h1 className="text-xl font-bold">Welcome back 👋</h1>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </section>
  );
};
export default DashboardLayout;
