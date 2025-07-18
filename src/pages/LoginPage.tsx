import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import LabelInput from "../components/inputs/LabelInput";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import {
  getAuthErrorMessage,
  getUser,
  loginWithEmailAndPassword,
} from "../services/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("login");
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const userCredential = await loginWithEmailAndPassword(
        formData.email,
        formData.password
      );

      // Get user and redirect accordingly
      const user = await getUser(userCredential.user.uid);
      login(user);
      const adminRoles = ["admin", "treasurer", "coach"];
      const memberRoles = ["member", "parent", "rider"];
      if (adminRoles.includes(user.role)) navigate("/admin/dashboard/members");
      else if (memberRoles.includes(user.role))
        navigate("/member/dashboard/profile");
      else navigate("/");
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {t("signIn")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("or")}{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {t("createAccount")}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <LabelInput
              label={t("emailAddress")}
              type="email"
              value={formData.email}
              errors={errors.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
            />

            <LabelInput
              label={t("password")}
              type="password"
              value={formData.password}
              errors={errors.password}
              onChange={(value) =>
                setFormData({ ...formData, password: value })
              }
            />

            {authError && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
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
                disabled={loading}
              >
                {loading ? t("button.signingIn") : t("button.signIn")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
