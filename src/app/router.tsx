import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../routes/admin/Dashboard";

import LoginPage from "../routes/auth/Login";
import ClubPage from "../routes/public/ClubPage";
import HomePage from "../routes/public/HomePage";

const Router = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/club/:clubId" element={<ClubPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
);

export default Router;
