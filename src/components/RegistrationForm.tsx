import { Switch } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  getAuthErrorMessage,
  registerWithEmailAndPassword,
} from "../services/auth";
import {
  checkClubNameExists,
  createClub,
  createUserProfile,
  generateInviteCode,
  joinClub,
  uploadClubLogo,
} from "../services/firestore";
import { useRegistrationStore } from "../store/useRegistrationStore";
import LabelInput from "./inputs/LabelInput";

const RegistrationForm = () => {
  const { t } = useTranslation(["register", "pricing"]);
  const {
    role,
    step,
    formData,
    selectedPlan,
    selectedBillingCycle,
    setRole,
    setStep,
    setFormData,
    setSelectedPlan,
    setSelectedBillingCycle,
  } = useRegistrationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle URL parameters for plan and billing cycle
  useEffect(() => {
    const plan = searchParams.get("plan") as "starter" | "pro" | "elite" | null;
    const billing = searchParams.get("billing") as "monthly" | "annual" | null;

    if (plan && ["starter", "pro", "elite"].includes(plan)) {
      setSelectedPlan(plan);
    }

    if (billing && ["monthly", "annual"].includes(billing)) {
      setSelectedBillingCycle(billing);
    }
  }, [searchParams, setSelectedPlan, setSelectedBillingCycle]);

  const validateInitialStep = async () => {
    const newErrors: Record<string, string> = {};

    if (role === "admin") {
      if (!formData.clubName) {
        newErrors.clubName = "Club name is required";
      } else {
        const exists = await checkClubNameExists(formData.clubName);
        if (exists) {
          newErrors.clubName = "This club name is already taken";
        }
      }
    }

    if (role === "member" && !formData.inviteCode) {
      newErrors.inviteCode = "Invite code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailsStep = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateInitialStep()) {
      setStep("details");
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (validateDetailsStep()) {
      setIsLoading(true);
      try {
        // Register user with Firebase Auth
        const userCredential = await registerWithEmailAndPassword(
          formData.email,
          formData.password
        );
        const userId = userCredential.user.uid;

        if (role === "admin") {
          // Upload club logo if provided
          let logoUrl: string | undefined;
          if (formData.logo) {
            logoUrl = await uploadClubLogo(
              formData.clubName?.toLowerCase().replace(/\s+/g, "-") ??
                "no-name",
              formData.logo
            );
          }

          // Create club
          const clubId = await createClub({
            name: formData.clubName!,
            logoUrl,
            createdBy: userId,
            inviteCode: generateInviteCode(),
            members: [userId],
            formattedName: formData
              .clubName!.toLowerCase()
              .replace(/\s+/g, "-"),
          });

          // Create user profile
          await createUserProfile(userId, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: "admin",
            clubId,
          });
        } else {
          // Join existing club
          const clubId = await joinClub(userId, formData.inviteCode!);

          // Create user profile
          await createUserProfile(userId, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: "member",
            clubId,
          });
        }

        // Reset form
        setFormData({
          clubName: "",
          inviteCode: "",
          firstName: "",
          lastName: "",
          email: "",
          logo: null,
          password: "",
        });

        // Redirect to dashboard
        navigate(role === "admin" ? "/admin/dashboard" : "/member/dashboard");
      } catch (error) {
        setAuthError(getAuthErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ logo: file });
  };

  const renderSelectedPlanInfo = () => {
    if (!selectedPlan || !selectedBillingCycle) return null;

    const plans = {
      starter: {
        name: t("pricing:plans.starter.name"),
        price: selectedBillingCycle === "monthly" ? 21 : 199,
      },
      pro: {
        name: t("pricing:plans.pro.name"),
        price: selectedBillingCycle === "monthly" ? 55 : 499,
      },
      elite: {
        name: t("pricing:plans.elite.name"),
        price: selectedBillingCycle === "monthly" ? 65 : 599,
      },
    };

    const plan = plans[selectedPlan];

    return (
      <div className="mb-6 rounded-lg bg-indigo-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-indigo-900">
              {t("register:selectedPlan", { name: plan.name })}
            </h3>
            <p className="text-sm text-indigo-700">
              €{plan.price}/
              {selectedBillingCycle === "monthly" ? "month" : "year"}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedPlan(undefined);
              setSelectedBillingCycle(undefined);
            }}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {t("register:change")}
          </button>
        </div>
      </div>
    );
  };

  const renderInitialStep = () => (
    <motion.div
      key="initial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleInitialSubmit} className="space-y-6">
        {role === "admin" ? (
          <LabelInput
            label={t("register:form.clubName")}
            value={formData.clubName || ""}
            errors={errors.clubName}
            onChange={(value) => setFormData({ clubName: value })}
          />
        ) : (
          <LabelInput
            label={t("register:form.inviteCode")}
            value={formData.inviteCode || ""}
            errors={errors.inviteCode}
            onChange={(value) => setFormData({ inviteCode: value })}
          />
        )}
        <div>
          <Button type="submit" variant="primary" fullWidth>
            {t("register:continue")}
          </Button>
        </div>
      </form>
    </motion.div>
  );

  const renderDetailsStep = () => (
    <motion.div
      key="details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleDetailsSubmit} className="space-y-6">
        {role === "admin" && (
          <div className="mt-4">
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700"
            >
              {t("register:form.clubLogo")}
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <LabelInput
            label={t("register:form.firstName")}
            value={formData.firstName || ""}
            errors={errors.firstName}
            onChange={(value) => setFormData({ firstName: value })}
          />

          <LabelInput
            label={t("register:form.lastName")}
            value={formData.lastName || ""}
            errors={errors.lastName}
            onChange={(value) => setFormData({ lastName: value })}
          />
        </div>

        <LabelInput
          label={t("register:form.email")}
          value={formData.email || ""}
          errors={errors.email}
          onChange={(value) => setFormData({ email: value })}
          type="email"
        />

        <LabelInput
          label={t("register:form.password")}
          value={formData.password || ""}
          errors={errors.password}
          onChange={(value) => setFormData({ password: value })}
          type="password"
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

        <div className="flex justify-between">
          <Button
            onClick={() => setStep("initial")}
            variant="outline"
            size="lg"
            disabled={isLoading}
          >
            {t("register:back")}
          </Button>
          <Button variant="primary" size="lg" disabled={isLoading}>
            {isLoading ? t("register:registering") : t("register:register")}
          </Button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("register:title")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t("register:signIn")}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Selected Plan Info */}
          {renderSelectedPlanInfo()}

          {/* Role Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <span className="text-sm font-medium text-gray-900 text-center sm:text-left">
              {t("register:registerAsMember")}
            </span>
            <Switch
              checked={role === "admin"}
              onChange={() => setRole(role === "admin" ? "member" : "admin")}
              className={`${
                role === "admin" ? "bg-indigo-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-shrink-0`}
            >
              <span className="sr-only">{t("register:toggleRole")}</span>
              <span
                className={`${
                  role === "admin" ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="text-sm font-medium text-gray-900 text-center sm:text-right">
              {t("register:registerAsAdmin")}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {step === "initial" ? renderInitialStep() : renderDetailsStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
