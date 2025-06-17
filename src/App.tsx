import React from "react";
import { HelmetProvider } from "react-helmet-async";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ClubProvider } from "./contexts/ClubContext";

// Pages
import RegistrationForm from "./components/RegistrationForm";
import ClubWebsite from "./pages/ClubWebsite";
import ClubWebsiteManager from "./pages/ClubWebsiteManager";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import MembersPage from "./pages/dashboard/admin/MembersPage";
import TreasuryPage from "./pages/dashboard/admin/TreasuryPage";
import EventsPage from "./pages/dashboard/EventsPage";
import MemberDashboard from "./pages/dashboard/member/MemberDashboard";
import MemberEventsPage from "./pages/dashboard/member/MemberEventsPage";
import TrainingPage from "./pages/dashboard/member/TrainingPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

// Component to handle authenticated user redirects
const AuthenticatedRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Navigate
      to={`/${user.role === "admin" ? "admin" : "member"}/dashboard`}
      replace
    />
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ClubProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<RegistrationForm />} />

              {/* Protected routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="treasury" element={<TreasuryPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="website" element={<ClubWebsiteManager />} />
              </Route>

              <Route
                path="/member/dashboard/*"
                element={
                  <ProtectedRoute requiredRole="member">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<MemberDashboard />} />
                <Route path="trainings" element={<TrainingPage />} />
                <Route path="events" element={<MemberEventsPage />} />
              </Route>

              {/* Club routes */}
              <Route path="/clubs/:clubId" element={<ClubWebsite />} />

              {/* Auth redirect */}
              <Route path="/dashboard" element={<AuthenticatedRedirect />} />

              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </ClubProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
