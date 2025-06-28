import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LabelInput from "../components/inputs/LabelInput";
import { Button } from "../components/ui/Button";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import { useClub } from "../hooks/useClub";
import {
  sendEmailVerificationLink,
  updateUserEmail,
} from "../services/firestore/authService";
import { UserData } from "../services/firestore/types";
import { updateUserProfile } from "../services/firestore/userService";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation("common");
  const { user, updateUser } = useAuth();
  const { club } = useClub();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  // Check if form has changed
  const hasFormChanged = () => {
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.email !== originalData.email
    );
  };

  const handleSendVerificationEmail = async () => {
    setSendingVerification(true);
    setErrors({});

    try {
      await sendEmailVerificationLink();
      setSuccessMessage(t("verificationEmailSent"));
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setSendingVerification(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("user", user?.uid);
      if (!user?.uid) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          // Explicitly add the document ID to the user data
          const userDataWithId = {
            ...data,
            id: userDoc.id,
          };
          console.log("Fetched user data:", userDataWithId);
          setUserData(userDataWithId);

          const initialFormData = {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
          };

          setFormData(initialFormData);
          setOriginalData(initialFormData);
        } else {
          console.error("User document does not exist");
          setErrors({ general: "User profile not found" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors({ general: "Failed to load profile data" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("firstName") + " is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("lastName") + " is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = t("email") + " is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!validateForm() || !user?.uid) return;

    setSaving(true);

    try {
      const updates: Partial<UserData> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };

      // Update Firestore user data
      await updateUserProfile(user.uid, updates);

      // Update email in Firebase Auth if it changed
      if (formData.email !== userData?.email) {
        try {
          await updateUserEmail(formData.email);

          // Update email in Firestore as well
          await updateUserProfile(user.uid, { email: formData.email });
        } catch (error: any) {
          if (error.message.includes("requires recent authentication")) {
            setErrors({ email: error.message });
            return;
          }
          if (error.code === "auth/operation-not-allowed") {
            setErrors({
              email:
                "Email verification required. Please verify your current email address before changing it. You can request a verification email from your account settings.",
            });
            return;
          }
          if (error.code === "auth/email-already-in-use") {
            setErrors({
              email: "This email is already in use by another account.",
            });
            return;
          }
          throw error;
        }
      }

      // Update local state
      setUserData((prev) =>
        prev ? { ...prev, ...updates, email: formData.email } : null
      );

      // Update auth context with new user data
      if (user) {
        const updatedUser = {
          ...user,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email,
        };
        updateUser(updatedUser);
      }

      // Update original data to reflect the saved state
      setOriginalData({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
      });

      setSuccessMessage(t("profileUpdated"));
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrors({
        general: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's a general error
  if (errors.general) {
    return (
      <div className="py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errors.general}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-14">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {t("profile")}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{t("manageProfile")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <LabelInput
                  label={t("firstName")}
                  type="text"
                  value={formData.firstName}
                  errors={errors.firstName}
                  onChange={(value) =>
                    setFormData({ ...formData, firstName: value })
                  }
                />

                <LabelInput
                  label={t("lastName")}
                  type="text"
                  value={formData.lastName}
                  errors={errors.lastName}
                  onChange={(value) =>
                    setFormData({ ...formData, lastName: value })
                  }
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <LabelInput
                  label={t("email")}
                  type="email"
                  value={formData.email}
                  errors={errors.email}
                  onChange={(value) =>
                    setFormData({ ...formData, email: value })
                  }
                />

                {/* Email verification notice */}
                {formData.email !== originalData.email && (
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          {t("emailChangeNotice")}
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>{t("emailVerificationRequired")}</p>
                        </div>
                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleSendVerificationEmail}
                            disabled={sendingVerification}
                          >
                            {sendingVerification
                              ? t("sending")
                              : t("sendVerificationEmail")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Read-only Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("role")}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    <span className="text-sm text-gray-900 capitalize">
                      {userData?.role || user?.role}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("club")}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    <span className="text-sm text-gray-900">
                      {club?.name || t("noClubAssigned")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {errors.general && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {errors.general}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        {successMessage}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving || !hasFormChanged()}
                >
                  {saving ? t("saving") : t("saveChanges")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
