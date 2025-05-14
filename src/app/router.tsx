import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../routes/admin/Dashboard";

import ProtectedRoute from "../components/ProtectedRoute";
// Auth
import LoginPage from "../routes/auth/Login";
import SignUp from "../routes/auth/SignUp";
// Admin
import ClubConfiguration from "../routes/admin/ClubConfiguration";
import Events from "../routes/admin/Events";
import Members from "../routes/admin/Members";
import Trainings from "../routes/admin/Trainings";
import ClubPage from "../routes/public/ClubPage";
import HomePage from "../routes/public/HomePage";

const Router = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/club/:clubId" element={<ClubPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUp />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/members"
      element={
        <ProtectedRoute>
          <Members />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/events"
      element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/trainings"
      element={
        <ProtectedRoute>
          <Trainings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/club-configuration"
      element={
        <ProtectedRoute>
          <ClubConfiguration />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default Router;
