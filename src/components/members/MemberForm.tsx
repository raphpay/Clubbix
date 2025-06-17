import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserData } from "../../services/firestore";
import LabelInput from "../inputs/LabelInput";
import { Button } from "../ui/Button";

interface MemberFormProps {
  member?: UserData;
  onSubmit: (data: Omit<UserData, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  member,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation("members");
  const [formData, setFormData] = useState({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    email: member?.email || "",
    role: member?.role || "member",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("form.fields.firstName.error");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("form.fields.lastName.error");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("form.fields.email.error.required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("form.fields.email.error.invalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await onSubmit(formData);
      if (!member) {
        setSuccessMessage(t("form.success.newMember"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: t("form.error") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LabelInput
          label={t("form.fields.firstName.label")}
          value={formData.firstName}
          onChange={(value) => setFormData({ ...formData, firstName: value })}
          errors={errors.firstName}
        />
        <LabelInput
          label={t("form.fields.lastName.label")}
          value={formData.lastName}
          onChange={(value) => setFormData({ ...formData, lastName: value })}
          errors={errors.lastName}
        />
      </div>

      <LabelInput
        label={t("form.fields.email.label")}
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        errors={errors.email}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t("form.fields.role.label")}
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as "admin" | "member",
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="member">{t("form.fields.role.options.member")}</option>
          <option value="admin">{t("form.fields.role.options.admin")}</option>
        </select>
      </div>

      {errors.submit && (
        <div className="text-red-600 text-sm">{errors.submit}</div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("form.buttons.cancel")}
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting
            ? t("form.buttons.saving")
            : member
            ? t("form.buttons.update")
            : t("form.buttons.add")}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
