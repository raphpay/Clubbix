import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClub } from "../../hooks/useClub";
import { TreasuryEntry } from "../../services/firestore/treasuryService";
import { UserData } from "../../services/firestore/types/user";
import { getMembersWithQuery } from "../../services/firestore/userService";

interface TreasuryFormProps {
  onAddEntry: (entry: Omit<TreasuryEntry, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const TreasuryForm: React.FC<TreasuryFormProps> = ({
  onAddEntry,
  onCancel,
}) => {
  const { t } = useTranslation("treasury");
  const { club } = useClub();
  const [formData, setFormData] = useState({
    type: "income" as const,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    memberId: "",
    memberName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberQuery, setMemberQuery] = useState("");
  const [memberOptions, setMemberOptions] = useState<UserData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [memberSearchLoading, setMemberSearchLoading] = useState(false);

  // Autocomplete effect
  useEffect(() => {
    if (!club?.id || !memberQuery) {
      setMemberOptions([]);
      return;
    }
    setMemberSearchLoading(true);
    getMembersWithQuery({ clubId: club.id, search: memberQuery, pageSize: 5 })
      .then((res) => setMemberOptions(res.members))
      .finally(() => setMemberSearchLoading(false));
  }, [memberQuery, club?.id]);

  function handleMemberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, memberName: value, memberId: "" }));
    setMemberQuery(value);
    setShowDropdown(!!value);
  }

  function handleSelectMember(member: UserData) {
    setFormData((prev) => ({
      ...prev,
      memberName: `${member.firstName} ${member.lastName}`,
      memberId: member.id || "",
    }));
    setShowDropdown(false);
  }

  function validateMemberField() {
    if (!formData.memberName) return true; // empty is allowed
    if (!formData.memberId) return false; // must select from dropdown
    return true;
  }

  const canSubmit = validateMemberField() && !loading && !error;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const entryData: Omit<TreasuryEntry, "id" | "createdAt"> = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        description: formData.description,
        category: formData.category,
        memberId: formData.memberId,
        memberName: formData.memberName,
      };

      onAddEntry(entryData);

      // Reset form
      setFormData({
        type: "income",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "",
        memberId: "",
        memberName: "",
      });

      onCancel();
    } catch (err) {
      setError(t("page.error.save"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("form.fields.type")}
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="income">{t("form.types.income")}</option>
            <option value="expense">{t("form.types.expense")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("form.fields.amount")}
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            placeholder={t("form.placeholders.amount")}
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("form.fields.date")}
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("form.fields.description")}
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            placeholder={t("form.placeholders.description")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("form.fields.category")}
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            placeholder={t("form.placeholders.category")}
          />
        </div>

        {/* Member field */}
        {formData.type === "income" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("form.fields.memberName")}
            </label>
            <input
              type="text"
              name="memberName"
              value={formData.memberName}
              onChange={handleMemberInput}
              onFocus={() => setShowDropdown(!!formData.memberName)}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              placeholder={t("form.placeholders.memberName")}
            />
            {showDropdown && memberOptions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow max-h-48 overflow-auto">
                {memberOptions.map((member) => (
                  <li
                    key={member.id}
                    className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                    onMouseDown={() => handleSelectMember(member)}
                  >
                    <span className="font-medium">
                      {member.firstName} {member.lastName}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {member.email}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {formData.memberName && !formData.memberId && (
              <div className="text-red-500 text-xs mt-1">
                {t("form.errors.memberNotFound")}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("form.buttons.cancel")}
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500"
          >
            {loading ? t("page.loading") : t("form.buttons.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreasuryForm;
