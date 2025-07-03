import React from "react";
import { useTranslation } from "react-i18next";
import { InviteData } from "../../services/firestore/types/club";
import { Button } from "../ui/Button";

interface CreateInviteCodeModalProps {
  form: Partial<InviteData>;
  error?: string;
  loading: boolean;
  setIsModalOpen: (value: boolean) => void;
  handleSubmit: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateInviteCodeModal: React.FC<CreateInviteCodeModalProps> = ({
  form,
  error,
  loading,
  setIsModalOpen,
  handleSubmit,
  handleChange,
  handleTagsChange,
}) => {
  const { t } = useTranslation("inviteMembers");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{t("createTitle")}</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">{t("type.title")}</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="single">{t("type.single")}</option>
              <option value="multi">{t("type.multi")}</option>
              <option value="unlimited">{t("type.unlimited")}</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">{t("list.role")}</label>
            <select
              name="role"
              value={form.role || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">{t("role.selectRole")}</option>
              <option value="member">{t("role.member")}</option>
              <option value="coach">{t("role.coach")}</option>
              <option value="parent">{t("role.parent")}</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">{t("tags", "Tags")}</label>
            <input
              name="tags"
              value={form.tags?.join(",") || ""}
              onChange={handleTagsChange}
              className="w-full border rounded p-2"
              placeholder="comma,separated,tags"
            />
          </div>
          {form.type === "multi" && (
            <div>
              <label className="block mb-1">{t("maxUses")}</label>
              <input
                name="maxUses"
                type="number"
                min={1}
                value={form.maxUses || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          )}
          <div>
            <label className="block mb-1">{t("expiresAt")}</label>
            <input
              name="expiresAt"
              type="date"
              value={
                typeof form.expiresAt === "string"
                  ? form.expiresAt
                  : form.expiresAt &&
                    typeof form.expiresAt.toDate === "function"
                  ? form.expiresAt.toDate().toISOString().slice(0, 10)
                  : ""
              }
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              {t("buttons.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading
                ? t("buttons.saving", "Saving...")
                : t("buttons.save", "Save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInviteCodeModal;
