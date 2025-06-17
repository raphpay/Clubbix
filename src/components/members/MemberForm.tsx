import React, { useState } from "react";
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
  const [formData, setFormData] = useState({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    email: member?.email || "",
    role: member?.role || "member",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to save member" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LabelInput
          label="First Name"
          value={formData.firstName}
          onChange={(value) => setFormData({ ...formData, firstName: value })}
          errors={errors.firstName}
        />
        <LabelInput
          label="Last Name"
          value={formData.lastName}
          onChange={(value) => setFormData({ ...formData, lastName: value })}
          errors={errors.lastName}
        />
      </div>

      <LabelInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        errors={errors.email}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
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
          <option value="member">Member</option>
          <option value="admin">Admin</option>
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
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : member ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
