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
import AdminDashboard from "./pages/AdminDashboard";
import ClubPage from "./pages/ClubPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MemberDashboard from "./pages/MemberDashboard";
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
                path="/admin/dashboard/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member/dashboard/*"
                element={
                  <ProtectedRoute requiredRole="member">
                    <DashboardLayout>
                      <MemberDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Club routes */}
              <Route path="/clubs/:slug" element={<ClubPage />} />

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
