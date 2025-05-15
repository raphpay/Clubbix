import Header from "../../components/Header";
import { useDashboardStore } from "../../stores/useDashboardStore";
import DashboardHome from "./DashboardHome";
import DashboardLayout from "./DashboardLayout";

const DashboardContent = () => {
  const section = useDashboardStore((state) => state.section);

  switch (section) {
    case "dashboard":
      return <DashboardHome />;
    default:
      return <div>Not Found</div>;
  }
};

const Dashboard = () => {
  return (
    <div>
      <Header />
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
