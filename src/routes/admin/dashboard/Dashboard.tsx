import Header from "../../../components/Header";
import { useDashboardStore } from "../../../stores/useDashboardStore";
import Events from "../events/Events";
import MembersList from "../members/Members";
import Trainings from "../trainings/Trainings";
import DashboardHome from "./DashboardHome";
import DashboardLayout from "./DashboardLayout";

const DashboardContent = () => {
  const section = useDashboardStore((state) => state.section);

  switch (section) {
    case "dashboard":
      return <DashboardHome />;
    case "members":
      return <MembersList />;
    case "events":
      return <Events />;
    case "trainings":
      return <Trainings />;
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
