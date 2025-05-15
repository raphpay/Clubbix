import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../routes/admin/dashboard/Dashboard";
import Events from "../routes/admin/events/Events";
import Members from "../routes/admin/members/Members";
import Trainings from "../routes/admin/trainings/Trainings";
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
  </Routes>
);

export default Router;
