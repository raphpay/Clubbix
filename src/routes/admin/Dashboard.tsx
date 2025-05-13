import Header from "../../components/Header";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <Header />
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <a href="/admin/members">Voir les membres</a>
    </div>
  );
};
export default AdminDashboard;
