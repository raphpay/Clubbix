import Header from "../../components/Header";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <Header />
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="flex gap-2">
        <a href="/admin/members">Voir les membres</a>
        <a href="/admin/events">Voir les évènements</a>
        <a href="/admin/trainings">Voir les entrainements</a>
      </div>
    </div>
  );
};
export default AdminDashboard;
