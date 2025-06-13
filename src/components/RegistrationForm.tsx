import { Switch } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useRegistrationStore } from "../store/useRegistrationStore";

const RegistrationForm = () => {
  const { role, step, formData, setRole, setStep, setFormData } =
    useRegistrationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInitialStep = () => {
    const newErrors: Record<string, string> = {};
    if (role === "admin" && !formData.clubName) {
      newErrors.clubName = "Club name is required";
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

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInitialStep()) {
      setStep("details");
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetailsStep()) {
      // Handle final form submission
      console.log("Form submitted:", formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ logo: file });
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
          <div>
            <label
              htmlFor="clubName"
              className="block text-sm font-medium text-gray-700"
            >
              Club Name
            </label>
            <input
              type="text"
              id="clubName"
              value={formData.clubName}
              onChange={(e) => setFormData({ clubName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1"
            />
            {errors.clubName && (
              <p className="mt-1 text-sm text-red-600">{errors.clubName}</p>
            )}
          </div>
        ) : (
          <div>
            <label
              htmlFor="inviteCode"
              className="block text-sm font-medium text-gray-700"
            >
              Invite Code
            </label>
            <input
              type="text"
              id="inviteCode"
              value={formData.inviteCode}
              onChange={(e) => setFormData({ inviteCode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1"
            />
            {errors.inviteCode && (
              <p className="mt-1 text-sm text-red-600">{errors.inviteCode}</p>
            )}
          </div>
        )}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue
          </button>
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
              Club Logo (Optional)
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
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ firstName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ lastName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep("initial")}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Role Toggle */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-medium text-gray-900">
              Register as Member
            </span>
            <Switch
              checked={role === "admin"}
              onChange={() => setRole(role === "admin" ? "member" : "admin")}
              className={`${
                role === "admin" ? "bg-indigo-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span className="sr-only">Toggle role</span>
              <span
                className={`${
                  role === "admin" ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="text-sm font-medium text-gray-900">
              Register as Admin
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
