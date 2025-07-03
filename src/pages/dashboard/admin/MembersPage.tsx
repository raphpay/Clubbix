import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteMemberModal from "../../../components/members/DeleteMemberModal";
import MemberForm from "../../../components/members/MemberForm";
import MemberList from "../../../components/members/MemberList";
import { useAuth } from "../../../hooks/useAuth";
import { useClub } from "../../../hooks/useClub";
import { deleteMember, updateMember } from "../../../services/firestore";

import { UserData } from "../../../services/firestore/types/user";

const MembersPage: React.FC = () => {
  const { t } = useTranslation("members");
  const { club } = useClub();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const currentUserId = user?.uid;

  function handleAddMember() {
    setSelectedMember(null);
    setIsFormOpen(true);
  }

  function handleEditMember(member: UserData) {
    setSelectedMember(member);
    setIsFormOpen(true);
  }

  function handleDeleteMember(member: UserData) {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  }

  async function handleFormSubmit(
    data: Omit<UserData, "id" | "createdAt" | "updatedAt" | "email">
  ) {
    if (!club?.id) return;
    if (!selectedMember || !selectedMember.id) return;
    if (
      !["admin", "treasurer", "rider", "coach", "parent"].includes(data.role)
    ) {
      setError(t("form.fields.role.error"));
      return;
    }
    if (
      selectedMember.id === currentUserId &&
      data.role !== selectedMember.role
    ) {
      setError(t("form.fields.role.selfChangeError"));
      return;
    }
    try {
      await updateMember(club.id, selectedMember.id, data);
      setIsFormOpen(false);
      setError(null);
      setReloadKey((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || t("page.error.save"));
    }
  }

  async function handleDeleteConfirm() {
    if (!club?.id || !selectedMember || !selectedMember.id) return;
    try {
      await deleteMember(club.id, selectedMember.id);
      setIsDeleteModalOpen(false);
      setError(null);
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      setError(t("page.error.delete"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t("page.title")}
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800">
        <MemberList
          onAddMember={handleAddMember}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
          reloadKey={reloadKey}
        />
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsFormOpen(false)}
          />

          {/* Modal container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Modal panel */}
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-gray-800">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setIsFormOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    {selectedMember
                      ? t("form.title.edit")
                      : t("form.title.add")}
                  </h3>
                  <div className="mt-4">
                    {selectedMember ? (
                      <MemberForm
                        member={selectedMember}
                        currentUserId={currentUserId}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMember && (
        <DeleteMemberModal
          member={selectedMember}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
          isOpen={isDeleteModalOpen}
        />
      )}
    </div>
  );
};

export default MembersPage;
