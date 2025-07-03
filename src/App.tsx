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
import { AuthProvider } from "./context/AuthContext";
import { ClubProvider } from "./contexts/ClubContext";
import { useAuth } from "./hooks/useAuth";

// Pages
import RegistrationForm from "./components/RegistrationForm";
import BookDemoPage from "./pages/BookDemoPage";
import CancelPage from "./pages/CancelPage";
import ClubWebsite from "./pages/ClubWebsite";
import ClubWebsiteManager from "./pages/ClubWebsiteManager";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import InviteMembersPage from "./pages/dashboard/admin/InviteMembersPage";
import MembersPage from "./pages/dashboard/admin/MembersPage";
import TreasuryPage from "./pages/dashboard/admin/TreasuryPage";
import EventsPage from "./pages/dashboard/EventsPage";
import MemberDashboard from "./pages/dashboard/member/MemberDashboard";
import MemberEventsPage from "./pages/dashboard/member/MemberEventsPage";
import TrainingPage from "./pages/dashboard/member/TrainingPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SuccessPage from "./pages/SuccessPage";

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

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/book-demo" element={<BookDemoPage />} />
      <Route path="/signup" element={<RegistrationForm />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      {/* Note: /signup?plan={plan}&billing={billingCycle} is handled by RegistrationForm */}

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
        <Route path="invites" element={<InviteMembersPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="website" element={<ClubWebsiteManager />} />
        <Route path="profile" element={<ProfilePage />} />
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
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Club routes */}
      <Route path="/clubs/:clubId" element={<ClubWebsite />} />

      {/* Auth redirect */}
      <Route path="/dashboard" element={<AuthenticatedRedirect />} />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ClubProvider>
          <Router>
            <AppContent />
          </Router>
        </ClubProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
