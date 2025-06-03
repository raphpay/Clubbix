import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../routes/admin/dashboard/Dashboard";
import LoginPage from "../routes/auth/Login";
import SignUp from "../routes/auth/SignUp";
import ClubPage from "../routes/public/ClubPage";
import HomePage from "../routes/public/home/HomePage";

const Router = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/club/:clubId" element={<ClubPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUp />} />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default Router;
