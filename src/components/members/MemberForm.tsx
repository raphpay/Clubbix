import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserData } from "../../services/firestore/types/user";
import LabelInput from "../inputs/LabelInput";
import { Button } from "../ui/Button";

interface MemberFormProps {
  member?: UserData;
  currentUserId?: string;
  onSubmit: (data: Omit<UserData, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

const ROLES = ["admin", "treasurer", "rider", "coach", "parent"] as const;
const STATUSES = ["active", "inactive"] as const;

function MemberForm({
  member,
  currentUserId,
  onSubmit,
  onCancel,
}: MemberFormProps) {
  const { t } = useTranslation("members");
  const initialData = {
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    role: member?.role || "rider",
    status: member?.status || "active",
    ageGroup: member?.ageGroup || "",
  };
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isSelf = member?.id && currentUserId && member.id === currentUserId;
  const isDirty = Object.keys(initialData).some(
    (key) =>
      formData[key as keyof typeof formData] !==
      initialData[key as keyof typeof initialData]
  );

  function validateForm() {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = t("form.fields.firstName.error");
    if (!formData.lastName.trim())
      newErrors.lastName = t("form.fields.lastName.error");
    if (!ROLES.includes(formData.role as any))
      newErrors.role = t("form.fields.role.error");
    if (!STATUSES.includes(formData.status as any))
      newErrors.status = t("form.fields.status.error");
    if (isSelf && formData.role !== member?.role)
      newErrors.role = t("form.fields.role.selfChangeError");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await onSubmit(formData);
      setSuccessMessage(t("form.success.update"));
    } catch (error) {
      setErrors({ submit: t("form.error") });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 text-green-800 text-sm font-medium">
          {successMessage}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LabelInput
          label={t("form.fields.firstName.label")}
          value={formData.firstName}
          onChange={(v) => setFormData({ ...formData, firstName: v })}
          errors={errors.firstName}
        />
        <LabelInput
          label={t("form.fields.lastName.label")}
          value={formData.lastName}
          onChange={(v) => setFormData({ ...formData, lastName: v })}
          errors={errors.lastName}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t("form.fields.role.label")}
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as UserData["role"],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          disabled={Boolean(isSelf)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {t(`form.fields.role.options.${r}`)}
            </option>
          ))}
        </select>
        {errors.role && (
          <div className="text-red-600 text-sm">{errors.role}</div>
        )}
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
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? t("form.buttons.saving") : t("form.buttons.save")}
        </Button>
      </div>
    </form>
  );
}

export default MemberForm;
