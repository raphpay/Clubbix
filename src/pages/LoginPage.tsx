import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LabelInput from "../components/inputs/LabelInput";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import {
  getAuthErrorMessage,
  getUserRole,
  loginWithEmailAndPassword,
} from "../services/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await loginWithEmailAndPassword(
        formData.email,
        formData.password
      );

      console.log("userCredential", userCredential);

      // Get user role and redirect accordingly
      const role = await getUserRole(userCredential.user.uid);
      login(role);
      navigate(role === "admin" ? "/admin/dashboard" : "/member/dashboard");
    } catch (error) {
      console.log("error", error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <LabelInput
              label="Email address"
              type="email"
              value={formData.email}
              errors={errors.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
            />

            <LabelInput
              label="Password"
              type="password"
              value={formData.password}
              errors={errors.password}
              onChange={(value) =>
                setFormData({ ...formData, password: value })
              }
            />

            {authError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {authError}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
