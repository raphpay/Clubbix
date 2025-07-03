import { nanoid } from "nanoid";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CreateInviteCodeModal from "../../../components/inviteMembers/CreateInviteCodeModal";
import InviteMembersList from "../../../components/inviteMembers/InviteMembersList";
import RevokeDeleteModal from "../../../components/inviteMembers/RevokeDeleteModal";
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
        <CreateInviteCodeModal
          form={form}
          loading={loading}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleTagsChange={handleTagsChange}
        />
      )}
      {/* Revoke/Delete Modal */}
      {modal.invite && (
        <RevokeDeleteModal
          type={modal.type}
          inviteCode={modal.invite.code}
          handleCancelModal={handleCancelModal}
          handleConfirmModal={handleConfirmModal}
        />
      )}
    </div>
  );
}

export default InviteMembersPage;
