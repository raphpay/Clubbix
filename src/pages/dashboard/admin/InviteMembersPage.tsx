import { nanoid } from "nanoid";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InviteMembersList from "../../../components/inviteMembers/InviteMembersList";
import { Button } from "../../../components/ui/Button";
import { useClub } from "../../../hooks/useClub";
import {
  createInvite,
  deleteInvite,
  revokeInvite,
} from "../../../services/firestore/clubService";
import { InviteData } from "../../../services/firestore/types/club";

function InviteMembersPage() {
  const { t } = useTranslation("inviteMembers");
  const { club } = useClub();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<InviteData>>({
    type: "single",
    used: 0,
    status: "active",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    type: "delete" | "revoke";
    invite: InviteData | null;
  }>({ type: "delete", invite: null });
  const [reloadKey, setReloadKey] = useState(0);

  function handleOpenModal() {
    setForm({ type: "single", used: 0, status: "active" });
    setIsModalOpen(true);
    setError("");
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({
      ...f,
      tags: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  }

  async function handleSubmit() {
    if (!form.role) {
      setError("Role is required");
      return;
    }
    if (!club?.id) return;
    setLoading(true);
    const code = `CLUB-${(form.role || "").toUpperCase()}-${nanoid(
      4
    ).toUpperCase()}`;
    const invite: Omit<InviteData, "createdAt"> = {
      code,
      type: form.type as any,
      maxUses: form.type === "multi" ? Number(form.maxUses) : 1000,
      used: 0,
      role: form.role!,
      tags: form.tags,
      expiresAt: form.expiresAt,
      status: "active",
    };

    try {
      await createInvite(club.id, invite);
      setIsModalOpen(false);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  function handleDeleteInvite(invite: InviteData) {
    setModal({ type: "delete", invite });
  }

  function handleRevokeInvite(invite: InviteData) {
    setModal({ type: "revoke", invite });
  }

  async function handleConfirmModal() {
    if (!club?.id || !modal.invite) return;
    if (modal.type === "delete") await deleteInvite(club.id, modal.invite.code);
    if (modal.type === "revoke") await revokeInvite(club.id, modal.invite.code);
    setModal({ type: "delete", invite: null });
    setReloadKey((k) => k + 1);
  }

  function handleCancelModal() {
    setModal({ type: "delete", invite: null });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t("title")}
        </h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800 overflow-x-auto">
        <InviteMembersList
          onAddInvite={handleOpenModal}
          onEditInvite={() => {}}
          onDeleteInvite={handleDeleteInvite}
          onRevokeInvite={handleRevokeInvite}
          key={reloadKey}
        />
      </div>
      {/* Create code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{t("createTitle")}</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">{t("type")}</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="single">{t("singleUse")}</option>
                  <option value="multi">{t("multiUse")}</option>
                  <option value="unlimited">{t("unlimited")}</option>
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
                  <label className="block mb-1">{t("invite.maxUses")}</label>
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
      )}
      {/* Revoke/Delete Modal */}
      {modal.invite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {modal.type === "delete"
                ? t("deleteModal.title")
                : t("revokeModal.title")}
            </h2>
            <div className="mb-4">
              {modal.type === "delete"
                ? t("deleteModal.message", { code: modal.invite.code })
                : t("revokeModal.message", { code: modal.invite.code })}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={handleCancelModal}>
                {t("buttons.cancel")}
              </Button>
              <Button variant="accent" onClick={handleConfirmModal}>
                {t("buttons.confirm")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InviteMembersPage;
